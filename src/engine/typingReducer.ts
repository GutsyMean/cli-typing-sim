import type { CommandEntry } from '../data/types'
import type { Behavior, TestMode } from '../settings/settingsStore'

export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'corrected'

export interface LineState {
  entry: CommandEntry
  typed: CharStatus[]
  /** chars typed at an index that was ever wrong (drives 'corrected' styling) */
  wrongOnce: boolean[]
  cursor: number
  /** overflow typed past the end of the line (forgiving mode only) */
  extra: string
  completed: boolean
}

export interface KeystrokeEvent {
  /** ms since test start */
  t: number
  kind: 'char' | 'backspace' | 'wordBackspace' | 'enter'
  correct?: boolean
  /** the char that should have been typed (for miss breakdown) */
  expected?: string
  category?: CommandEntry['category']
}

export interface EngineConfig {
  behavior: Behavior
  mode: TestMode
  /** timed mode only */
  durationMs: number
  /** commands mode only */
  commandCount: number
}

export interface EngineState {
  config: EngineConfig
  status: 'idle' | 'running' | 'finished'
  lines: LineState[]
  lineIndex: number
  startedAt: number | null
  endedAt: number | null
  keystrokes: KeystrokeEvent[]
}

export type EngineAction =
  | { type: 'reset'; queue: CommandEntry[]; config: EngineConfig }
  | { type: 'appendLine'; entry: CommandEntry }
  | { type: 'typeChar'; char: string; now: number }
  | { type: 'backspace'; now: number }
  | { type: 'wordBackspace'; now: number }
  | { type: 'enter'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'finishNow'; now: number }

const makeLine = (entry: CommandEntry): LineState => ({
  entry,
  typed: new Array<CharStatus>(entry.text.length).fill('pending'),
  wrongOnce: new Array<boolean>(entry.text.length).fill(false),
  cursor: 0,
  extra: '',
  completed: false,
})

export const initEngine = (
  queue: CommandEntry[],
  config: EngineConfig,
): EngineState => ({
  config,
  status: 'idle',
  lines: queue.map(makeLine),
  lineIndex: 0,
  startedAt: null,
  endedAt: null,
  keystrokes: [],
})

const timeUp = (state: EngineState, now: number): boolean =>
  state.config.mode === 'timed' &&
  state.startedAt !== null &&
  now - state.startedAt >= state.config.durationMs

const finish = (state: EngineState, now: number): EngineState => ({
  ...state,
  status: 'finished',
  endedAt: Math.min(
    now,
    state.config.mode === 'timed' && state.startedAt !== null
      ? state.startedAt + state.config.durationMs
      : now,
  ),
})

function withKeystroke(
  state: EngineState,
  now: number,
  event: Omit<KeystrokeEvent, 't'>,
): EngineState {
  const startedAt = state.startedAt ?? now
  return {
    ...state,
    status: 'running',
    startedAt,
    keystrokes: [...state.keystrokes, { t: now - startedAt, ...event }],
  }
}

function replaceLine(state: EngineState, line: LineState): EngineState {
  const lines = state.lines.slice()
  lines[state.lineIndex] = line
  return { ...state, lines }
}

export function typingReducer(
  state: EngineState,
  action: EngineAction,
): EngineState {
  switch (action.type) {
    case 'reset':
      return initEngine(action.queue, action.config)

    case 'appendLine':
      return { ...state, lines: [...state.lines, makeLine(action.entry)] }

    case 'tick':
      if (state.status !== 'running') return state
      return timeUp(state, action.now) ? finish(state, action.now) : state

    // endless mode: the user decides when the session is over
    case 'finishNow':
      if (state.status !== 'running') return state
      return finish(state, action.now)
  }

  if (state.status === 'finished') return state
  const line = state.lines[state.lineIndex]
  if (!line) return state

  switch (action.type) {
    case 'typeChar': {
      const { char, now } = action
      const target = line.entry.text

      if (line.cursor >= target.length) {
        // A trailing space is harmless in a real shell — swallow it silently
        // so it can't block enter.
        if (char === ' ' && line.extra.length === 0) return state
        // Past the end: only possible in forgiving mode, always an error.
        if (state.config.behavior === 'stop-on-error') return state
        let next = withKeystroke(state, now, {
          kind: 'char',
          correct: false,
          expected: '⏎',
          category: line.entry.category,
        })
        next = replaceLine(next, { ...line, extra: line.extra + char })
        return timeUp(next, now) ? finish(next, now) : next
      }

      const expected = target[line.cursor]
      const correct = char === expected
      let next = withKeystroke(state, now, {
        kind: 'char',
        correct,
        expected,
        category: line.entry.category,
      })

      if (!correct && state.config.behavior === 'stop-on-error') {
        // Caret sticks; mark the char as currently wrong so it shows red.
        const typed = line.typed.slice()
        const wrongOnce = line.wrongOnce.slice()
        typed[line.cursor] = 'incorrect'
        wrongOnce[line.cursor] = true
        return replaceLine(next, { ...line, typed, wrongOnce })
      }

      const typed = line.typed.slice()
      const wrongOnce = line.wrongOnce.slice()
      if (!correct) wrongOnce[line.cursor] = true
      typed[line.cursor] = correct
        ? wrongOnce[line.cursor]
          ? 'corrected'
          : 'correct'
        : 'incorrect'
      next = replaceLine(next, {
        ...line,
        typed,
        wrongOnce,
        cursor: line.cursor + 1,
      })
      return timeUp(next, now) ? finish(next, now) : next
    }

    case 'backspace': {
      if (line.extra.length > 0) {
        const next = withKeystroke(state, action.now, { kind: 'backspace' })
        return replaceLine(next, { ...line, extra: line.extra.slice(0, -1) })
      }
      // stop-on-error: a stuck wrong char sits AT the cursor — backspace
      // clears only its highlight without deleting the previous char.
      if (line.typed[line.cursor] === 'incorrect' && line.cursor < line.typed.length) {
        const typed = line.typed.slice()
        typed[line.cursor] = 'pending'
        return replaceLine(state, { ...line, typed })
      }
      if (line.cursor === 0) return state
      const next = withKeystroke(state, action.now, { kind: 'backspace' })
      const typed = line.typed.slice()
      typed[line.cursor - 1] = 'pending'
      return replaceLine(next, { ...line, typed, cursor: line.cursor - 1 })
    }

    case 'wordBackspace': {
      if (line.cursor === 0 && line.extra.length === 0) return state
      const next = withKeystroke(state, action.now, { kind: 'wordBackspace' })
      const target = line.entry.text

      if (line.extra.length > 0) {
        // wipe extra plus the word behind it
        let c = line.cursor
        while (c > 0 && target[c - 1] === ' ') c--
        while (c > 0 && target[c - 1] !== ' ') c--
        const typed = line.typed.slice()
        for (let i = c; i < line.cursor; i++) typed[i] = 'pending'
        return replaceLine(next, { ...line, typed, extra: '', cursor: c })
      }

      let c = line.cursor
      while (c > 0 && target[c - 1] === ' ') c--
      while (c > 0 && target[c - 1] !== ' ') c--
      const typed = line.typed.slice()
      if (typed[line.cursor] === 'incorrect') typed[line.cursor] = 'pending'
      for (let i = c; i < line.cursor; i++) typed[i] = 'pending'
      return replaceLine(next, { ...line, typed, cursor: c })
    }

    case 'enter': {
      const target = line.entry.text
      const atEnd = line.cursor === target.length && line.extra.length === 0
      if (!atEnd || state.status === 'idle') return state

      let next = withKeystroke(state, action.now, { kind: 'enter' })
      next = replaceLine(next, { ...line, completed: true })

      const isLast =
        next.config.mode === 'commands' &&
        state.lineIndex + 1 >= next.config.commandCount
      if (isLast) return finish(next, action.now)
      if (timeUp(next, action.now)) return finish(next, action.now)

      return { ...next, lineIndex: state.lineIndex + 1 }
    }
  }

  return state
}
