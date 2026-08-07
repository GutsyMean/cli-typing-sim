import { describe, expect, it } from 'vitest'
import type { FlagEntry } from '../data/flags'
import type { CommandEntry } from '../data/types'
import { nextInt, nextRandom, shuffleSeeded } from '../lib/rng'
import { chooseClozeToken, tokenize } from './cloze'
import { diffStatuses, normalizeAnswer } from './diff'
import { pickDistractors } from './distractors'
import { initLearn, learnReducer, summarize, type LearnState } from './learnReducer'
import { commandKey } from './learnStore'
import { buildQuestion, sanitizeQuestionText, type QuestionPools } from './questions'
import { buildStudyItems, flagKey, studyKey, type StudyItem } from './studyItems'

const entry = (
  text: string,
  category: CommandEntry['category'] = 'bash',
  difficulty: CommandEntry['difficulty'] = 1,
): CommandEntry => ({ text, category, difficulty, desc: `does ${text}` })

const flag = (
  tool: string,
  f: string,
  category: FlagEntry['category'] = 'bash',
  difficulty: FlagEntry['difficulty'] = 1,
): FlagEntry => ({ tool, flag: f, desc: `${tool} ${f} meaning`, category, difficulty })

const cmdItem = (e: CommandEntry): StudyItem => ({ kind: 'command', entry: e })

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

const FLAGS = [
  flag('ls', '-la'),
  flag('ls', '-R'),
  flag('df', '-h'),
  flag('tar', '-czf'),
  flag('tar', '-xzf'),
]

const pools = (commands = POOL, flags: FlagEntry[] = []): QuestionPools => ({
  commands,
  flags,
})

const freshState = (commandPool = POOL, persisted = {}) =>
  initLearn(
    buildStudyItems(commandPool, [], 'commands'),
    pools(commandPool),
    persisted,
    12345,
  )

function answerCurrentMc(state: LearnState, correct: boolean, now = 1000): LearnState {
  const q = state.queue[0]
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
    const s = initLearn(buildStudyItems(POOL, [], 'commands'), pools(), persisted, 7)
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
    const s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 7)
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
    expect(s.queue[0].uid).not.toBe(answered.uid)
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
    let s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
    const q = s.queue[0]
    expect(q.qtype).toBe('cloze')
    for (const ch of q.answer!) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.levels[q.key]).toBe(2)

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
    let s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
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
    let s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
    const q = s.queue[0]
    for (const ch of q.answer!) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.levels[q.key]).toBe(3)
    expect(s.masteredThisSession).toContain(q.key)
    expect(s.queue.find((x) => x.key === q.key)).toBeUndefined()
  })

  it('wrong recall goes diff → reinforce, which gates on a clean copy-type', () => {
    const pool = [entry('ls -la'), entry('df -h')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [commandKey(pool[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    let s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
    const answered = s.queue[0]
    for (const ch of 'wrong') s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    const phase = s.phase
    if (phase.name !== 'recall-diff') throw new Error('expected recall-diff phase')
    expect(phase.question.uid).toBe(answered.uid)
    expect(s.levels[answered.key]).toBe(1) // demoted
    s = learnReducer(s, { type: 'advance' })
    expect(s.phase.name).toBe('reinforce')

    s = learnReducer(s, { type: 'reinforceEnter' })
    expect(s.phase.name).toBe('reinforce')

    const text = answered.answer!
    s = learnReducer(s, { type: 'reinforceChar', char: 'x' })
    s = learnReducer(s, { type: 'reinforceBackspace' })
    for (const ch of text) s = learnReducer(s, { type: 'reinforceChar', char: ch })
    s = learnReducer(s, { type: 'reinforceEnter' })
    expect(s.phase.name).toBe('asking')
    expect(s.reinforce).toBeNull()
    expect(s.queue.some((x) => x.key === answered.key)).toBe(true)
  })

  it('finishing every command reaches round-complete then summary', () => {
    const pool = [entry('ls -la')]
    const persisted = {
      [commandKey(pool[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
    }
    let s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
    for (const ch of pool[0].text) s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    s = learnReducer(s, { type: 'advance' })
    expect(s.phase.name).toBe('round-complete')
    expect(s.roundsCompleted).toBe(1)
    s = learnReducer(s, { type: 'advance' })
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
    const s = initLearn(buildStudyItems(pool, [], 'commands'), pools(pool), persisted, 3)
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

describe('sanitizeQuestionText', () => {
  it('strips parentheticals that contain flags', () => {
    expect(sanitizeQuestionText('long format including hidden entries (-l + -a)')).toBe(
      'long format including hidden entries',
    )
    expect(sanitizeQuestionText('list subdirectories too (/s), quietly')).toBe(
      'list subdirectories too, quietly',
    )
  })

  it('keeps benign parentheticals and never returns empty', () => {
    expect(sanitizeQuestionText('include hidden entries (names starting with .)')).toBe(
      'include hidden entries (names starting with .)',
    )
    expect(sanitizeQuestionText('(-l + -a)')).toBe('(-l + -a)') // fallback to original
  })

  it('flag question prompts and options are sanitized', () => {
    const leaky = flag('ls', '-la')
    leaky.desc = 'long format including hidden (-l + -a)'
    const item: StudyItem = { kind: 'flag', flag: leaky }
    const fp = pools([], [leaky, ...FLAGS])
    const [q0] = buildQuestion(item, 0, fp, 5, 1, [leaky, ...FLAGS])
    expect(q0.comment).not.toContain('(-l')
    const [q1] = buildQuestion(item, 1, fp, 5, 2, [leaky, ...FLAGS])
    expect(q1.options![q1.correctIndex!]).toBe('long format including hidden')
    const [q2] = buildQuestion(item, 2, fp, 5, 3, [leaky, ...FLAGS])
    expect(q2.comment).not.toContain('(-l')
  })
})

describe('flag study items', () => {
  const flagItems = buildStudyItems([], FLAGS, 'flags')
  const flagPools = pools([], FLAGS)

  it('scope both mixes commands and flags; scopes filter', () => {
    expect(buildStudyItems(POOL, FLAGS, 'both')).toHaveLength(POOL.length + FLAGS.length)
    expect(buildStudyItems(POOL, FLAGS, 'commands')).toHaveLength(POOL.length)
    expect(buildStudyItems(POOL, FLAGS, 'flags')).toHaveLength(FLAGS.length)
  })

  it('flag ladder: flag-mc → flag-which → flag-recall', () => {
    const item = flagItems[0]
    const [q0] = buildQuestion(item, 0, flagPools, 5, 1, FLAGS)
    expect(q0.qtype).toBe('flag-mc')
    expect(q0.options).toContain(
      item.kind === 'flag' ? item.flag.flag : '',
    )
    const [q1] = buildQuestion(item, 1, flagPools, 5, 2, FLAGS)
    expect(q1.qtype).toBe('flag-which')
    expect(q1.options).toContain(item.kind === 'flag' ? item.flag.desc : '')
    const [q2] = buildQuestion(item, 2, flagPools, 5, 3, FLAGS)
    expect(q2.qtype).toBe('flag-recall')
    expect(q2.answer).toBe(item.kind === 'flag' ? item.flag.flag : '')
  })

  it('flag-recall grades on exact flag text and wrong flag answers never reinforce', () => {
    const persisted = {
      [flagKey(FLAGS[0])]: { level: 2 as const, lastSeen: 1, misses: 0 },
      [flagKey(FLAGS[1])]: { level: 2 as const, lastSeen: 2, misses: 0 },
    }
    let s = initLearn(
      buildStudyItems([], FLAGS.slice(0, 2), 'flags'),
      pools([], FLAGS),
      persisted,
      3,
    )
    const q = s.queue[0]
    expect(q.qtype).toBe('flag-recall')
    for (const ch of 'bogus') s = learnReducer(s, { type: 'inputChar', char: ch })
    s = learnReducer(s, { type: 'submitInput', now: 100 })
    expect(s.phase.name).toBe('feedback')
    expect(s.reinforce).toBeNull()
    expect(s.levels[q.key]).toBe(1)

    // now the correct one
    s = learnReducer(s, { type: 'advance' })
    const q2 = s.queue[0]
    if (q2.qtype === 'flag-recall') {
      for (const ch of q2.answer!) s = learnReducer(s, { type: 'inputChar', char: ch })
      s = learnReducer(s, { type: 'submitInput', now: 200 })
      expect(s.levels[q2.key]).toBe(3)
    }
  })

  it('mixed batches sort flags and commands by level together', () => {
    const s = initLearn(
      buildStudyItems(POOL.slice(0, 3), FLAGS.slice(0, 3), 'both'),
      pools(POOL, FLAGS),
      {},
      9,
    )
    expect(s.batch.length).toBe(6)
    const kinds = new Set(s.queue.map((q) => q.item.kind))
    expect(kinds.has('command')).toBe(true)
    expect(kinds.has('flag')).toBe(true)
  })

  it('flag distractor descs and flags are unique within options', () => {
    const item = flagItems[0]
    const [q] = buildQuestion(item, 0, flagPools, 5, 1, FLAGS)
    expect(new Set(q.options).size).toBe(q.options!.length)
  })
})

describe('buildQuestion (commands)', () => {
  it('level 0 builds mc with the correct entry among options', () => {
    const [q] = buildQuestion(cmdItem(POOL[0]), 0, pools(), 9, 1)
    expect(q.qtype).toBe('mc')
    expect(q.uid).toBe(1)
    expect(q.options!.length).toBeGreaterThanOrEqual(2)
    expect(q.options![q.correctIndex!]).toBe(POOL[0].text)
  })

  it('level 1 on an un-clozeable command substitutes recall', () => {
    const [q] = buildQuestion(cmdItem(entry('"hello world"')), 1, pools(), 9, 1)
    expect(q.qtype).toBe('recall')
  })

  it('study keys distinguish commands from flags', () => {
    expect(studyKey(cmdItem(POOL[0]))).toBe(commandKey(POOL[0]))
    expect(studyKey({ kind: 'flag', flag: FLAGS[0] })).toContain('flag:')
  })
})
