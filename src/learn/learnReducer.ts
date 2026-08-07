import type { CategoryId } from '../data/types'
import type { CharStatus } from '../engine/typingReducer'
import { shuffleSeeded } from '../lib/rng'
import { diffStatuses, normalizeAnswer, type AnswerDiff } from './diff'
import type { MasteryLevel, MasteryRecord } from './learnStore'
import { buildQuestion, type QType, type Question, type QuestionPools } from './questions'
import { itemCategory, itemLabel, studyKey, type StudyItem } from './studyItems'

export const BATCH_SIZE = 7
const REQUEUE_GAP = 2
const SCROLLBACK_MAX = 6

export type LearnPhase =
  | { name: 'asking' }
  // feedback phases carry the ANSWERED question — the queue has already
  // advanced, so rendering queue[0] here would leak the next question
  | {
      name: 'feedback'
      question: Question
      correct: boolean
      chosenIndex?: number
      typed?: string
    }
  | { name: 'recall-diff'; question: Question; typed: string; diff: AnswerDiff }
  | { name: 'reinforce' }
  | { name: 'round-complete' }
  | { name: 'summary' }

export interface ReinforceState {
  entry: { text: string; category: CategoryId; desc: string; difficulty: 1 | 2 | 3 }
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
  label: string
  category: CategoryId
  correct: boolean
}

export interface LearnState {
  items: StudyItem[]
  pools: QuestionPools
  levels: Record<string, MasteryLevel>
  lastSeen: Record<string, number>
  sessionMisses: Record<string, number>
  batch: string[]
  queue: Question[]
  nextUid: number
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
  weakest: { label: string; desc: string; misses: number }[]
  roundsCompleted: number
  nothingToLearn: boolean
}

const MC_TYPES: QType[] = ['mc', 'flag-mc', 'flag-which']
export const isMcType = (t: QType) => MC_TYPES.includes(t)

const currentQuestion = (state: LearnState): Question | undefined => state.queue[0]

function candidates(state: LearnState): StudyItem[] {
  return state.items
    .filter((item) => (state.levels[studyKey(item)] ?? 0) < 3)
    .sort((a, b) => {
      const ka = studyKey(a)
      const kb = studyKey(b)
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
  const take = pending.slice(0, BATCH_SIZE)
  const [shuffled, shuffleSeed] = shuffleSeeded(take, state.rngSeed)
  let seed = shuffleSeed
  let uid = state.nextUid
  const queue: Question[] = []
  for (const item of shuffled) {
    const [q, nextSeed] = buildQuestion(
      item,
      state.levels[studyKey(item)] ?? 0,
      state.pools,
      seed,
      uid++,
    )
    seed = nextSeed
    queue.push(q)
  }
  return {
    ...state,
    batch: shuffled.map(studyKey),
    queue,
    nextUid: uid,
    phase: { name: 'asking' },
    input: '',
    reinforce: null,
    rngSeed: seed,
  }
}

export function initLearn(
  items: StudyItem[],
  pools: QuestionPools,
  persisted: Record<string, MasteryRecord>,
  seed: number,
): LearnState {
  const levels: Record<string, MasteryLevel> = {}
  const lastSeen: Record<string, number> = {}
  for (const item of items) {
    const rec = persisted[studyKey(item)]
    if (rec) {
      levels[studyKey(item)] = rec.level
      lastSeen[studyKey(item)] = rec.lastSeen
    }
  }
  const base: LearnState = {
    items,
    pools,
    levels,
    lastSeen,
    sessionMisses: {},
    batch: [],
    queue: [],
    nextUid: 1,
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
    {
      id: answered.length,
      label: itemLabel(q.item),
      category: itemCategory(q.item),
      correct,
    },
  ].slice(-SCROLLBACK_MAX)

  const rest = state.queue.slice(1)
  let queue = rest
  let rngSeed = state.rngSeed
  let nextUid = state.nextUid
  let masteredThisSession = state.masteredThisSession
  if (newLevel === 3) {
    masteredThisSession = [...masteredThisSession, q.key]
  } else {
    const [fresh, nextSeed] = buildQuestion(q.item, newLevel, state.pools, rngSeed, nextUid++)
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
    nextUid,
    masteredThisSession,
    input: '',
  }
}

export function learnReducer(state: LearnState, action: LearnAction): LearnState {
  if (action.type === 'finish') {
    return { ...state, phase: { name: 'summary' } }
  }
  if (state.phase.name === 'summary') return state
  const q = currentQuestion(state)

  switch (action.type) {
    case 'chooseMc': {
      if (state.phase.name !== 'asking' || !q || !isMcType(q.qtype)) return state
      if (!q.options || action.index < 0 || action.index >= q.options.length) return state
      const correct = action.index === q.correctIndex
      const next = grade(state, q, correct, action.now)
      return {
        ...next,
        phase: { name: 'feedback', question: q, correct, chosenIndex: action.index },
      }
    }

    case 'inputChar': {
      if (state.phase.name !== 'asking' || !q || isMcType(q.qtype)) return state
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
      if (state.phase.name !== 'asking' || !q || isMcType(q.qtype)) return state
      if (state.input.trim() === '') return state
      const typed = state.input.trim()

      if (q.qtype === 'cloze' || q.qtype === 'flag-recall') {
        const correct = typed === q.answer
        const next = grade(state, q, correct, action.now)
        return { ...next, phase: { name: 'feedback', question: q, correct, typed } }
      }

      // full command recall
      const expected = q.item.kind === 'command' ? q.item.entry.text : ''
      const correct = normalizeAnswer(state.input) === normalizeAnswer(expected)
      const next = grade(state, q, correct, action.now)
      if (correct) {
        return { ...next, phase: { name: 'feedback', question: q, correct: true } }
      }
      return {
        ...next,
        phase: {
          name: 'recall-diff',
          question: q,
          typed: normalizeAnswer(state.input),
          diff: diffStatuses(normalizeAnswer(state.input), expected),
        },
        reinforce: {
          entry: q.item.kind === 'command' ? q.item.entry : { text: expected, category: itemCategory(q.item), desc: '', difficulty: 1 },
          typed: new Array<CharStatus>(expected.length).fill('pending'),
          wrongOnce: new Array<boolean>(expected.length).fill(false),
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
      return { ...state, reinforce: { ...r, typed, wrongOnce, cursor: r.cursor + 1 } }
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
      const complete = r.cursor === r.entry.text.length && !r.typed.includes('incorrect')
      if (!complete) return state
      // grading already happened at submit; reinforce just gates progression
      const next: LearnState = { ...state, reinforce: null, input: '' }
      if (next.queue.length === 0) {
        return {
          ...next,
          phase: { name: 'round-complete' },
          roundsCompleted: next.roundsCompleted + 1,
        }
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
    'flag-mc': { correct: 0, total: 0 },
    'flag-which': { correct: 0, total: 0 },
    'flag-recall': { correct: 0, total: 0 },
  }
  for (const a of state.answered) {
    byType[a.qtype].total++
    if (a.correct) byType[a.qtype].correct++
  }
  const byKey = new Map(state.items.map((item) => [studyKey(item), item]))
  const weakest = Object.entries(state.sessionMisses)
    .map(([key, misses]) => ({ item: byKey.get(key), misses }))
    .filter((w): w is { item: StudyItem; misses: number } => w.item !== undefined)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 5)
    .map((w) => ({
      label: itemLabel(w.item),
      desc: w.item.kind === 'command' ? w.item.entry.desc : w.item.flag.desc,
      misses: w.misses,
    }))
  return {
    mastered: state.masteredThisSession.length,
    totalAnswered: state.answered.length,
    byType,
    weakest,
    roundsCompleted: state.roundsCompleted,
    nothingToLearn: state.answered.length === 0 && state.batch.length === 0,
  }
}
