import type { CommandEntry } from '../data/types'
import type { CharStatus } from '../engine/typingReducer'
import { shuffleSeeded } from '../lib/rng'
import { diffStatuses, normalizeAnswer, type AnswerDiff } from './diff'
import { commandKey, type MasteryLevel, type MasteryRecord } from './learnStore'
import { buildQuestion, type QType, type Question } from './questions'

export const BATCH_SIZE = 7
const REQUEUE_GAP = 2
const SCROLLBACK_MAX = 6

export type LearnPhase =
  | { name: 'asking' }
  | { name: 'feedback'; correct: boolean; chosenIndex?: number; typed?: string }
  | { name: 'recall-diff'; typed: string; diff: AnswerDiff }
  | { name: 'reinforce' }
  | { name: 'round-complete' }
  | { name: 'summary' }

export interface ReinforceState {
  entry: CommandEntry
  typed: CharStatus[]
  wrongOnce: boolean[]
  cursor: number
}

export interface AnswerRecord {
  key: string
  qtype: QType
  correct: boolean
}

export interface ScrollbackItem {
  id: number
  entry: CommandEntry
  qtype: QType
  correct: boolean
}

export interface LearnState {
  pool: CommandEntry[]
  levels: Record<string, MasteryLevel>
  lastSeen: Record<string, number>
  sessionMisses: Record<string, number>
  batch: string[]
  queue: Question[]
  phase: LearnPhase
  input: string
  reinforce: ReinforceState | null
  answered: AnswerRecord[]
  scrollback: ScrollbackItem[]
  masteredThisSession: string[]
  roundsCompleted: number
  rngSeed: number
}

export type LearnAction =
  | {
      type: 'init'
      pool: CommandEntry[]
      persisted: Record<string, MasteryRecord>
      seed: number
    }
  | { type: 'chooseMc'; index: number; now: number }
  | { type: 'inputChar'; char: string }
  | { type: 'inputBackspace' }
  | { type: 'inputWordBackspace' }
  | { type: 'submitInput'; now: number }
  | { type: 'reinforceChar'; char: string }
  | { type: 'reinforceBackspace' }
  | { type: 'reinforceWordBackspace' }
  | { type: 'reinforceEnter' }
  | { type: 'advance' }
  | { type: 'finish' }

export interface LearnSummary {
  mastered: number
  totalAnswered: number
  byType: Record<QType, { correct: number; total: number }>
  weakest: { entry: CommandEntry; misses: number }[]
  roundsCompleted: number
  nothingToLearn: boolean
}

const currentQuestion = (state: LearnState): Question | undefined => state.queue[0]

function candidates(state: LearnState): CommandEntry[] {
  return state.pool
    .filter((e) => (state.levels[commandKey(e)] ?? 0) < 3)
    .sort((a, b) => {
      const ka = commandKey(a)
      const kb = commandKey(b)
      const la = state.levels[ka] ?? 0
      const lb = state.levels[kb] ?? 0
      if (la !== lb) return la - lb
      return (state.lastSeen[ka] ?? 0) - (state.lastSeen[kb] ?? 0)
    })
}

function startRound(state: LearnState): LearnState {
  const pending = candidates(state)
  if (pending.length === 0) {
    return { ...state, batch: [], queue: [], phase: { name: 'summary' } }
  }
  // shuffle within the take so equal-priority commands vary between rounds
  const take = pending.slice(0, BATCH_SIZE)
  let [shuffled, seed] = shuffleSeeded(take, state.rngSeed)
  const queue: Question[] = []
  for (const entry of shuffled) {
    const [q, nextSeed] = buildQuestion(
      entry,
      state.levels[commandKey(entry)] ?? 0,
      state.pool,
      seed,
    )
    seed = nextSeed
    queue.push(q)
  }
  return {
    ...state,
    batch: shuffled.map(commandKey),
    queue,
    phase: { name: 'asking' },
    input: '',
    reinforce: null,
    rngSeed: seed,
  }
}

export function initLearn(
  pool: CommandEntry[],
  persisted: Record<string, MasteryRecord>,
  seed: number,
): LearnState {
  const levels: Record<string, MasteryLevel> = {}
  const lastSeen: Record<string, number> = {}
  for (const e of pool) {
    const rec = persisted[commandKey(e)]
    if (rec) {
      levels[commandKey(e)] = rec.level
      lastSeen[commandKey(e)] = rec.lastSeen
    }
  }
  const base: LearnState = {
    pool,
    levels,
    lastSeen,
    sessionMisses: {},
    batch: [],
    queue: [],
    phase: { name: 'asking' },
    input: '',
    reinforce: null,
    answered: [],
    scrollback: [],
    masteredThisSession: [],
    roundsCompleted: 0,
    rngSeed: seed,
  }
  return startRound(base)
}

/** Apply a graded answer: level move, requeue, bookkeeping. Leaves phase alone. */
function grade(state: LearnState, q: Question, correct: boolean, now: number): LearnState {
  const level = state.levels[q.key] ?? 0
  const newLevel = (correct ? Math.min(3, level + 1) : Math.max(0, level - 1)) as MasteryLevel

  const levels = { ...state.levels, [q.key]: newLevel }
  const lastSeen = { ...state.lastSeen, [q.key]: now }
  const sessionMisses = correct
    ? state.sessionMisses
    : { ...state.sessionMisses, [q.key]: (state.sessionMisses[q.key] ?? 0) + 1 }
  const answered = [...state.answered, { key: q.key, qtype: q.qtype, correct }]
  const scrollback = [
    ...state.scrollback,
    { id: answered.length, entry: q.entry, qtype: q.qtype, correct },
  ].slice(-SCROLLBACK_MAX)

  const rest = state.queue.slice(1)
  let queue = rest
  let rngSeed = state.rngSeed
  let masteredThisSession = state.masteredThisSession
  if (newLevel === 3) {
    masteredThisSession = [...masteredThisSession, q.key]
  } else {
    const [fresh, nextSeed] = buildQuestion(q.entry, newLevel, state.pool, rngSeed)
    rngSeed = nextSeed
    const at = Math.min(rest.length, REQUEUE_GAP)
    queue = [...rest.slice(0, at), fresh, ...rest.slice(at)]
  }

  return {
    ...state,
    levels,
    lastSeen,
    sessionMisses,
    answered,
    scrollback,
    queue,
    rngSeed,
    masteredThisSession,
    input: '',
  }
}

export function learnReducer(state: LearnState, action: LearnAction): LearnState {
  switch (action.type) {
    case 'init':
      return initLearn(action.pool, action.persisted, action.seed)

    case 'finish':
      return { ...state, phase: { name: 'summary' } }
  }

  if (state.phase.name === 'summary') return state
  const q = currentQuestion(state)

  switch (action.type) {
    case 'chooseMc': {
      if (state.phase.name !== 'asking' || !q || q.qtype !== 'mc') return state
      if (!q.options || action.index < 0 || action.index >= q.options.length)
        return state
      const correct = action.index === q.correctIndex
      const next = grade(state, q, correct, action.now)
      return { ...next, phase: { name: 'feedback', correct, chosenIndex: action.index } }
    }

    case 'inputChar': {
      if (state.phase.name !== 'asking' || !q || q.qtype === 'mc') return state
      return { ...state, input: state.input + action.char }
    }

    case 'inputBackspace': {
      if (state.phase.name !== 'asking') return state
      return { ...state, input: state.input.slice(0, -1) }
    }

    case 'inputWordBackspace': {
      if (state.phase.name !== 'asking') return state
      const trimmed = state.input.replace(/ +$/, '')
      const cut = trimmed.lastIndexOf(' ')
      return { ...state, input: cut === -1 ? '' : trimmed.slice(0, cut + 1) }
    }

    case 'submitInput': {
      if (state.phase.name !== 'asking' || !q || q.qtype === 'mc') return state
      if (state.input.trim() === '') return state

      if (q.qtype === 'cloze') {
        const correct = state.input.trim() === q.mask?.token
        const next = grade(state, q, correct, action.now)
        return {
          ...next,
          phase: { name: 'feedback', correct, typed: state.input.trim() },
        }
      }

      // full recall
      const correct = normalizeAnswer(state.input) === normalizeAnswer(q.entry.text)
      const next = grade(state, q, correct, action.now)
      if (correct) return { ...next, phase: { name: 'feedback', correct: true } }
      return {
        ...next,
        phase: {
          name: 'recall-diff',
          typed: normalizeAnswer(state.input),
          diff: diffStatuses(normalizeAnswer(state.input), q.entry.text),
        },
        reinforce: {
          entry: q.entry,
          typed: new Array<CharStatus>(q.entry.text.length).fill('pending'),
          wrongOnce: new Array<boolean>(q.entry.text.length).fill(false),
          cursor: 0,
        },
      }
    }

    case 'reinforceChar': {
      if (state.phase.name !== 'reinforce' || !state.reinforce) return state
      const r = state.reinforce
      const target = r.entry.text
      if (r.cursor >= target.length) return state
      const correct = action.char === target[r.cursor]
      const typed = r.typed.slice()
      const wrongOnce = r.wrongOnce.slice()
      if (!correct) wrongOnce[r.cursor] = true
      typed[r.cursor] = correct ? (wrongOnce[r.cursor] ? 'corrected' : 'correct') : 'incorrect'
      return {
        ...state,
        reinforce: { ...r, typed, wrongOnce, cursor: r.cursor + 1 },
      }
    }

    case 'reinforceBackspace': {
      if (state.phase.name !== 'reinforce' || !state.reinforce) return state
      const r = state.reinforce
      if (r.cursor === 0) return state
      const typed = r.typed.slice()
      typed[r.cursor - 1] = 'pending'
      return { ...state, reinforce: { ...r, typed, cursor: r.cursor - 1 } }
    }

    case 'reinforceWordBackspace': {
      if (state.phase.name !== 'reinforce' || !state.reinforce) return state
      const r = state.reinforce
      if (r.cursor === 0) return state
      const target = r.entry.text
      let c = r.cursor
      while (c > 0 && target[c - 1] === ' ') c--
      while (c > 0 && target[c - 1] !== ' ') c--
      const typed = r.typed.slice()
      for (let i = c; i < r.cursor; i++) typed[i] = 'pending'
      return { ...state, reinforce: { ...r, typed, cursor: c } }
    }

    case 'reinforceEnter': {
      if (state.phase.name !== 'reinforce' || !state.reinforce) return state
      const r = state.reinforce
      const complete =
        r.cursor === r.entry.text.length && !r.typed.includes('incorrect')
      if (!complete) return state
      // grading already happened at submit; reinforce just gates progression
      const next: LearnState = { ...state, reinforce: null, input: '' }
      if (next.queue.length === 0) {
        return { ...next, phase: { name: 'round-complete' }, roundsCompleted: next.roundsCompleted + 1 }
      }
      return { ...next, phase: { name: 'asking' } }
    }

    case 'advance': {
      switch (state.phase.name) {
        case 'feedback': {
          if (state.queue.length === 0) {
            return {
              ...state,
              phase: { name: 'round-complete' },
              roundsCompleted: state.roundsCompleted + 1,
            }
          }
          return { ...state, phase: { name: 'asking' }, input: '' }
        }
        case 'recall-diff':
          return { ...state, phase: { name: 'reinforce' } }
        case 'round-complete':
          return startRound(state)
        default:
          return state
      }
    }
  }

  return state
}

export function summarize(state: LearnState): LearnSummary {
  const byType: LearnSummary['byType'] = {
    mc: { correct: 0, total: 0 },
    cloze: { correct: 0, total: 0 },
    recall: { correct: 0, total: 0 },
  }
  for (const a of state.answered) {
    byType[a.qtype].total++
    if (a.correct) byType[a.qtype].correct++
  }
  const byKey = new Map(state.pool.map((e) => [commandKey(e), e]))
  const weakest = Object.entries(state.sessionMisses)
    .map(([key, misses]) => ({ entry: byKey.get(key), misses }))
    .filter((w): w is { entry: CommandEntry; misses: number } => w.entry !== undefined)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 5)
  return {
    mastered: state.masteredThisSession.length,
    totalAnswered: state.answered.length,
    byType,
    weakest,
    roundsCompleted: state.roundsCompleted,
    nothingToLearn: state.answered.length === 0 && state.batch.length === 0,
  }
}
