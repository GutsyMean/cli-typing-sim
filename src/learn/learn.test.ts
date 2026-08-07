import { describe, expect, it } from 'vitest'
import type { CommandEntry } from '../data/types'
import { nextInt, nextRandom, shuffleSeeded } from '../lib/rng'
import { chooseClozeToken, tokenize } from './cloze'
import { diffStatuses, normalizeAnswer } from './diff'
import { pickDistractors } from './distractors'
import { initLearn, learnReducer, summarize, type LearnState } from './learnReducer'
import { commandKey } from './learnStore'
import { buildQuestion } from './questions'

const entry = (
  text: string,
  category: CommandEntry['category'] = 'bash',
  difficulty: CommandEntry['difficulty'] = 1,
): CommandEntry => ({ text, category, difficulty, desc: `does ${text}` })

describe('rng', () => {
  it('is deterministic for a given seed', () => {
    expect(nextRandom(42)).toEqual(nextRandom(42))
    expect(nextInt(10, 7)[0]).toBe(nextInt(10, 7)[0])
    const [a] = shuffleSeeded([1, 2, 3, 4, 5], 99)
    const [b] = shuffleSeeded([1, 2, 3, 4, 5], 99)
    expect(a).toEqual(b)
  })

  it('shuffle leaves the input untouched and threads the seed', () => {
    const input = [1, 2, 3, 4, 5]
    const [, seed2] = shuffleSeeded(input, 1)
    expect(input).toEqual([1, 2, 3, 4, 5])
    expect(seed2).not.toBe(1)
  })
})

describe('cloze', () => {
  it('merges quoted tokens with offsets', () => {
    const tokens = tokenize('git commit -m "wip: new stuff" --amend')
    expect(tokens.map((t) => t.text)).toEqual([
      'git',
      'commit',
      '-m',
      '"wip: new stuff"',
      '--amend',
    ])
    expect(tokens[3].start).toBe('git commit -m '.length)
  })

  it('prefers the longest flag and never masks quoted strings', () => {
    const mask = chooseClozeToken('git commit -m "wip: new stuff" --amend')
    expect(mask?.token).toBe('--amend')
  })

  it('falls back to the subcommand when there are no flags', () => {
    expect(chooseClozeToken('git status')?.token).toBe('status')
  })

  it('never masks shell operators', () => {
    const mask = chooseClozeToken('ps aux | grep nginx')
    expect(mask?.token).toBe('aux')
  })

  it('masks the command itself when the rest is filenames/paths', () => {
    expect(chooseClozeToken('mv draft.md posts/final.md')?.token).toBe('mv')
    expect(chooseClozeToken('cd /tmp')?.token).toBe('cd')
  })

  it('masks the whole command for single-token commands', () => {
    expect(chooseClozeToken('pwd')).toEqual({ start: 0, length: 3, token: 'pwd' })
  })

  it('returns null only when everything is quoted or operators', () => {
    expect(chooseClozeToken('"hello world"')).toBeNull()
  })

  it('mask start/length address the raw string', () => {
    const text = 'tail -f /var/log/syslog'
    const mask = chooseClozeToken(text)!
    expect(text.slice(mask.start, mask.start + mask.length)).toBe(mask.token)
  })
})

describe('distractors', () => {
  const pool = [
    entry('ls -la'),
    entry('cd /tmp'),
    entry('pwd'),
    entry('df -h'),
    entry('git status', 'git'),
  ]

  it('prefers same category, dedupes, never includes the correct text', () => {
    const [picks] = pickDistractors(pool[0], pool, 1, pool)
    expect(picks).toHaveLength(3)
    expect(picks.every((p) => p.text !== 'ls -la')).toBe(true)
    expect(new Set(picks.map((p) => p.text)).size).toBe(3)
    expect(picks.every((p) => p.category === 'bash')).toBe(true)
  })

  it('excludes duplicate texts across categories', () => {
    const dupPool = [entry('ls -la'), entry('ls -la', 'git'), entry('cd /tmp'), entry('pwd')]
    const [picks] = pickDistractors(dupPool[0], dupPool, 5, dupPool)
    expect(picks.every((p) => p.text !== 'ls -la')).toBe(true)
  })

  it('tops up from the wider set when the pool is tiny', () => {
    const all = [entry('ls -la'), entry('cd /tmp'), entry('pwd'), entry('df -h')]
    const [picks] = pickDistractors(all[0], [all[0]], 3, all)
    expect(picks).toHaveLength(3)
  })
})

describe('diff', () => {
  it('marks per-char statuses and overflow', () => {
    const d = diffStatuses('git stauts', 'git status')
    expect(d.statuses.slice(0, 6)).toEqual([
      'correct', 'correct', 'correct', 'correct', 'correct', 'correct',
    ])
    expect(d.statuses).toContain('incorrect')
    expect(diffStatuses('ls', 'ls -la').statuses.slice(2)).toEqual([
      'pending', 'pending', 'pending', 'pending',
    ])
    expect(diffStatuses('ls -la -x', 'ls -la').extra).toBe(' -x')
  })

  it('normalizes whitespace', () => {
    expect(normalizeAnswer('  git   status ')).toBe('git status')
  })
})

const POOL = [
  entry('ls -la'),
  entry('cd /tmp'),
  entry('df -h'),
  entry('git status', 'git'),
  entry('git log --oneline', 'git'),
  entry('docker ps -a', 'docker'),
  entry('docker images', 'docker'),
  entry('pwd'),
  entry('history | tail'),
]

const freshState = (pool = POOL, persisted = {}) => initLearn(pool, persisted, 12345)

function answerCurrentMc(state: LearnState, correct: boolean, now = 1000): LearnState {
  const q = state.queue[0]
  expect(q.qtype).toBe('mc')
  const index = correct
    ? q.correctIndex!
    : (q.correctIndex! + 1) % q.options!.length
  return learnReducer(state, { type: 'chooseMc', index, now })
}

describe('learnReducer', () => {
  it('init builds a batch of at most 7 prioritizing lowest level', () => {
    const persisted = {
      [commandKey(POOL[0])]: { level: 3 as const, lastSeen: 1, misses: 0 },
      [commandKey(POOL[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    const s = initLearn(POOL, persisted, 7)
    expect(s.batch.length).toBe(7)
    expect(s.batch).not.toContain(commandKey(POOL[0])) // mastered excluded
    // seven level-0 commands outrank the lone level-2 one for the first batch
    expect(s.batch).not.toContain(commandKey(POOL[1]))
    expect(s.queue.every((q) => q.qtype === 'mc')).toBe(true)
  })

  it('higher-level commands enter the batch when there is room', () => {
    const pool = POOL.slice(0, 3)
    const persisted = {
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    const s = initLearn(pool, persisted, 7)
    expect(s.batch).toContain(commandKey(pool[1]))
    expect(s.queue.find((q) => q.key === commandKey(pool[1]))?.qtype).toBe('recall')
  })

  it('small pools make small batches', () => {
    const s = freshState(POOL.slice(0, 2))
    expect(s.batch.length).toBe(2)
  })

  it('correct mc promotes to cloze and requeues with a gap of 2', () => {
    let s = freshState()
    const answered = s.queue[0]
    s = answerCurrentMc(s, true)
    expect(s.levels[answered.key]).toBe(1)
    expect(s.phase.name).toBe('feedback')
    // requeued at index 2 as a cloze with a fresh uid
    const requeued = s.queue.findIndex((q) => q.key === answered.key)
    expect(requeued).toBe(2)
    expect(['cloze', 'recall']).toContain(s.queue[requeued].qtype)
    expect(s.queue[requeued].uid).not.toBe(answered.uid)
  })

  it('feedback carries the answered question, not the advanced queue head', () => {
    let s = freshState()
    const answered = s.queue[0]
    s = answerCurrentMc(s, true)
    const phase = s.phase
    if (phase.name !== 'feedback') throw new Error('expected feedback phase')
    expect(phase.question.uid).toBe(answered.uid)
    // the queue has moved on to a different question
    expect(s.queue[0].uid).not.toBe(answered.uid)
  })

  it('wrong recall phase carries the answered question for the diff', () => {
    const pool = [entry('ls -la'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    const answered = s.queue[0]
    for (const ch of 'wrong') s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    const phase = s.phase
    if (phase.name !== 'recall-diff') throw new Error('expected recall-diff phase')
    expect(phase.question.uid).toBe(answered.uid)
  })

  it('wrong mc keeps level at floor 0 and counts a miss', () => {
    let s = freshState()
    const key = s.queue[0].key
    s = answerCurrentMc(s, false)
    expect(s.levels[key]).toBe(0)
    expect(s.sessionMisses[key]).toBe(1)
    const phase = s.phase as { name: string; correct: boolean }
    expect(phase.correct).toBe(false)
  })

  it('cloze grading is exact on the token; wrong demotes', () => {
    const pool = [entry('tail -f /var/log/syslog'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 1 as const, lastSeen: 5, misses: 0 },
      [commandKey(pool[1])]: { level: 1 as const, lastSeen: 5, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    const q = s.queue[0]
    expect(q.qtype).toBe('cloze')
    for (const ch of q.mask!.token) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.levels[q.key]).toBe(2)

    // now answer the other cloze wrongly
    s = learnReducer(s, { type: 'advance' })
    const q2 = s.queue[0]
    for (const ch of 'nope') s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 200 })
    expect(s.levels[q2.key]).toBe(0)
  })

  it('empty input never submits', () => {
    const pool = [entry('ls -la'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 1, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.phase.name).toBe('asking')
    expect(s.answered).toHaveLength(0)
  })

  it('correct recall masters the command and removes it from the queue', () => {
    const pool = [entry('ls -la'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 1, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    const q = s.queue[0]
    for (const ch of q.entry.text) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.levels[q.key]).toBe(3)
    expect(s.masteredThisSession).toContain(q.key)
    expect(s.queue.find((x) => x.key === q.key)).toBeUndefined()
  })

  it('recall accepts extra whitespace', () => {
    const pool = [entry('git status', 'git'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    const q = s.queue[0]
    for (const ch of ` ${q.entry.text.replace(' ', '  ')} `)
      s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.levels[q.key]).toBe(3)
  })

  it('wrong recall goes diff → reinforce, which gates on a clean copy-type', () => {
    const pool = [entry('ls -la'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    const q = s.queue[0]
    for (const ch of 'wrong') s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.phase.name).toBe('recall-diff')
    expect(s.levels[q.key]).toBe(1) // demoted
    s = learnReducer(s, { type: 'advance' })
    expect(s.phase.name).toBe('reinforce')

    // enter with nothing typed is rejected
    s = learnReducer(s, { type: 'reinforceEnter' })
    expect(s.phase.name).toBe('reinforce')

    // type it with one mistake corrected along the way
    const text = q.entry.text
    s = learnReducer(s, { type: 'reinforceChar', char: 'x' })
    s = learnReducer(s, { type: 'reinforceBackspace' })
    for (const ch of text) s = learnReducer(s, { type: 'reinforceChar', char: ch })
    s = learnReducer(s, { type: 'reinforceEnter' })
    expect(s.phase.name).toBe('asking')
    expect(s.reinforce).toBeNull()
    // the demoted command is requeued
    expect(s.queue.some((x) => x.key === q.key)).toBe(true)
  })

  it('finishing every command reaches round-complete then summary', () => {
    const pool = [entry('ls -la')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
    }
    let s = initLearn(pool, persisted, 3)
    for (const ch of pool[0].text) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    s = learnReducer(s, { type: 'advance' }) // feedback → round-complete
    expect(s.phase.name).toBe('round-complete')
    expect(s.roundsCompleted).toBe(1)
    s = learnReducer(s, { type: 'advance' }) // no candidates left → summary
    expect(s.phase.name).toBe('summary')
  })

  it('finish jumps to summary from any phase; summarize aggregates', () => {
    let s = freshState()
    s = answerCurrentMc(s, true, 100)
    s = learnReducer(s, { type: 'advance' })
    s = answerCurrentMc(s, false, 200)
    s = learnReducer(s, { type: 'finish' })
    expect(s.phase.name).toBe('summary')
    const sum = summarize(s)
    expect(sum.totalAnswered).toBe(2)
    expect(sum.byType.mc).toEqual({ correct: 1, total: 2 })
    expect(sum.weakest).toHaveLength(1)
    expect(sum.nothingToLearn).toBe(false)
  })

  it('all-mastered pool lands directly on summary with nothingToLearn', () => {
    const pool = [entry('ls -la')]
    const persisted = {
      [commandKey(pool[0])]: { level: 3 as const, lastSeen: 1, misses: 0 },
    }
    const s = initLearn(pool, persisted, 3)
    expect(s.phase.name).toBe('summary')
    expect(summarize(s).nothingToLearn).toBe(true)
  })

  it('single-command batches requeue immediately', () => {
    const pool = [entry('ls -la')]
    let s = freshState(pool)
    expect(s.batch.length).toBe(1)
    s = answerCurrentMc(s, true)
    expect(s.queue).toHaveLength(1)
    expect(s.queue[0].key).toBe(commandKey(pool[0]))
  })
})

describe('buildQuestion', () => {
  it('level 0 builds mc with the correct entry among options', () => {
    const [q] = buildQuestion(POOL[0], 0, POOL, 9, 1)
    expect(q.qtype).toBe('mc')
    expect(q.uid).toBe(1)
    expect(q.options!.length).toBeGreaterThanOrEqual(2)
    expect(q.options![q.correctIndex!]).toBe(POOL[0])
  })

  it('level 1 on an un-clozeable command substitutes recall', () => {
    const [q] = buildQuestion(entry('"hello world"'), 1, POOL, 9, 1)
    expect(q.qtype).toBe('recall')
  })
})
