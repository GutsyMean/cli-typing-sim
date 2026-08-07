import { describe, expect, it } from 'vitest'
import type { CommandEntry } from '../data/types'
import { computeMetrics } from './metrics'
import {
  initEngine,
  typingReducer,
  type EngineAction,
  type EngineConfig,
  type EngineState,
} from './typingReducer'

const entry = (text: string): CommandEntry => ({
  text,
  category: 'bash',
  difficulty: 1,
  desc: 'test',
})

const config = (over: Partial<EngineConfig> = {}): EngineConfig => ({
  behavior: 'forgiving',
  mode: 'commands',
  durationMs: 30_000,
  commandCount: 2,
  ...over,
})

const run = (state: EngineState, ...actions: EngineAction[]) =>
  actions.reduce(typingReducer, state)

const typeString = (state: EngineState, text: string, startT = 0) =>
  [...text].reduce(
    (s, char, i) => typingReducer(s, { type: 'typeChar', char, now: startT + i * 100 }),
    state,
  )

describe('typingReducer', () => {
  it('starts idle and runs on first keystroke', () => {
    const s0 = initEngine([entry('ls')], config())
    expect(s0.status).toBe('idle')
    const s1 = typingReducer(s0, { type: 'typeChar', char: 'l', now: 1000 })
    expect(s1.status).toBe('running')
    expect(s1.startedAt).toBe(1000)
    expect(s1.keystrokes[0]).toMatchObject({ t: 0, kind: 'char', correct: true })
  })

  it('marks correct and incorrect chars, forgiving mode advances', () => {
    const s = typeString(initEngine([entry('ls')], config()), 'lx')
    const line = s.lines[0]
    expect(line.typed).toEqual(['correct', 'incorrect'])
    expect(line.cursor).toBe(2)
  })

  it('backspace + retype marks char corrected', () => {
    let s = typeString(initEngine([entry('ls')], config()), 'lx')
    s = run(s, { type: 'backspace', now: 300 }, { type: 'typeChar', char: 's', now: 400 })
    expect(s.lines[0].typed).toEqual(['correct', 'corrected'])
  })

  it('stop-on-error: cursor sticks on wrong char, still logs the miss', () => {
    const cfg = config({ behavior: 'stop-on-error' })
    let s = typeString(initEngine([entry('ls')], cfg), 'x')
    expect(s.lines[0].cursor).toBe(0)
    expect(s.lines[0].typed[0]).toBe('incorrect')
    expect(s.keystrokes.filter((k) => k.kind === 'char' && !k.correct)).toHaveLength(1)
    // backspace clears the stuck highlight without moving the cursor
    s = typingReducer(s, { type: 'backspace', now: 200 })
    expect(s.lines[0].typed[0]).toBe('pending')
    expect(s.lines[0].cursor).toBe(0)
    // correct char proceeds
    s = typingReducer(s, { type: 'typeChar', char: 'l', now: 300 })
    expect(s.lines[0].cursor).toBe(1)
  })

  it('extra chars past the end are errors and block enter until deleted', () => {
    let s = typeString(initEngine([entry('ls'), entry('cd')], config()), 'lsx')
    expect(s.lines[0].extra).toBe('x')
    s = typingReducer(s, { type: 'enter', now: 900 })
    expect(s.lineIndex).toBe(0) // blocked
    s = run(s, { type: 'backspace', now: 1000 }, { type: 'enter', now: 1100 })
    expect(s.lineIndex).toBe(1)
    expect(s.lines[0].completed).toBe(true)
  })

  it('enter mid-line is ignored', () => {
    let s = typeString(initEngine([entry('ls')], config()), 'l')
    s = typingReducer(s, { type: 'enter', now: 500 })
    expect(s.lineIndex).toBe(0)
    expect(s.lines[0].completed).toBe(false)
  })

  it('commands mode finishes after enter on the last line', () => {
    const cfg = config({ commandCount: 2 })
    let s = initEngine([entry('ls'), entry('cd')], cfg)
    s = typeString(s, 'ls')
    s = typingReducer(s, { type: 'enter', now: 300 })
    expect(s.status).toBe('running')
    s = typeString(s, 'cd', 400)
    s = typingReducer(s, { type: 'enter', now: 700 })
    expect(s.status).toBe('finished')
    expect(s.endedAt).toBe(700)
  })

  it('timed mode finishes on tick past duration, endedAt clamped', () => {
    const cfg = config({ mode: 'timed', durationMs: 5000 })
    let s = typeString(initEngine([entry('ls')], cfg), 'l')
    s = typingReducer(s, { type: 'tick', now: 3000 })
    expect(s.status).toBe('running')
    s = typingReducer(s, { type: 'tick', now: 5600 })
    expect(s.status).toBe('finished')
    expect(s.endedAt).toBe(5000) // clamped to startedAt + duration
  })

  it('word backspace deletes back to the previous word boundary', () => {
    let s = typeString(initEngine([entry('git status')], config()), 'git sta')
    s = typingReducer(s, { type: 'wordBackspace', now: 900 })
    const line = s.lines[0]
    expect(line.cursor).toBe(4)
    expect(line.typed.slice(4)).toEqual([
      'pending',
      'pending',
      'pending',
      'pending',
      'pending',
      'pending',
    ])
    // second word-backspace crosses the space and wipes 'git '
    s = typingReducer(s, { type: 'wordBackspace', now: 1000 })
    expect(s.lines[0].cursor).toBe(0)
  })

  it('appendLine grows the queue for timed mode', () => {
    let s = initEngine([entry('ls')], config({ mode: 'timed' }))
    s = typingReducer(s, { type: 'appendLine', entry: entry('cd /tmp') })
    expect(s.lines).toHaveLength(2)
  })

  it('a trailing space past the end is swallowed and never blocks enter', () => {
    let s = typeString(initEngine([entry('ls'), entry('cd')], config()), 'ls ')
    expect(s.lines[0].extra).toBe('')
    expect(s.keystrokes.filter((k) => k.kind === 'char')).toHaveLength(2)
    s = typingReducer(s, { type: 'enter', now: 500 })
    expect(s.lineIndex).toBe(1)
    // but a space after real overflow chars still backspaces normally
    let s2 = typeString(initEngine([entry('ls'), entry('cd')], config()), 'lsx ')
    expect(s2.lines[0].extra).toBe('x ')
  })

  it('endless mode never auto-finishes; finishNow ends it', () => {
    const cfg = config({ mode: 'endless' })
    let s = typeString(initEngine([entry('ls'), entry('cd')], cfg), 'ls')
    s = typingReducer(s, { type: 'enter', now: 300 })
    s = typingReducer(s, { type: 'tick', now: 999_999 })
    expect(s.status).toBe('running')
    s = typingReducer(s, { type: 'finishNow', now: 5000 })
    expect(s.status).toBe('finished')
    expect(s.endedAt).toBe(5000)
  })

  it('no keystrokes mutate state after finish', () => {
    const cfg = config({ commandCount: 1 })
    let s = typeString(initEngine([entry('ls')], cfg), 'ls')
    s = typingReducer(s, { type: 'enter', now: 300 })
    expect(s.status).toBe('finished')
    const after = typingReducer(s, { type: 'typeChar', char: 'x', now: 400 })
    expect(after.keystrokes).toHaveLength(s.keystrokes.length)
  })
})

describe('computeMetrics', () => {
  it('computes wpm, raw and accuracy', () => {
    // 50 correct + 10 wrong chars over 60s: wpm = 50/5 = 10, raw = 12
    const keystrokes = Array.from({ length: 60 }, (_, i) => ({
      t: i * 1000,
      kind: 'char' as const,
      correct: i < 50,
      expected: 'a',
    }))
    const m = computeMetrics(keystrokes, 60_000)
    expect(m.wpm).toBeCloseTo(10)
    expect(m.raw).toBeCloseTo(12)
    expect(m.accuracy).toBeCloseTo((50 / 60) * 100)
    expect(m.errorCount).toBe(10)
  })

  it('perfectly steady typing yields 100 consistency', () => {
    // 2 chars every second for 10s
    const keystrokes = Array.from({ length: 20 }, (_, i) => ({
      t: i * 500,
      kind: 'char' as const,
      correct: true,
    }))
    const m = computeMetrics(keystrokes, 10_000)
    expect(m.consistency).toBeGreaterThan(99)
  })

  it('bins errors per second and ranks missed chars', () => {
    const keystrokes = [
      { t: 100, kind: 'char' as const, correct: false, expected: '-' },
      { t: 200, kind: 'char' as const, correct: false, expected: '-' },
      { t: 1500, kind: 'char' as const, correct: false, expected: '|' },
      { t: 1600, kind: 'char' as const, correct: true },
    ]
    const m = computeMetrics(keystrokes, 2000)
    expect(m.bins[0].errors).toBe(2)
    expect(m.bins[1].errors).toBe(1)
    expect(m.missedChars[0]).toEqual({ char: '-', count: 2 })
  })

  it('handles empty keystroke log', () => {
    const m = computeMetrics([], 10_000)
    expect(m.wpm).toBe(0)
    expect(m.accuracy).toBe(100)
  })

  it('excludes line-boundary pauses from wpm time', () => {
    // 2 chars in 1s, then a long pre-enter pause, enter, a long post-enter
    // pause, then 2 more chars in 1s. Active time = 2s, not 10s.
    const keystrokes = [
      { t: 0, kind: 'char' as const, correct: true },
      { t: 1000, kind: 'char' as const, correct: true },
      { t: 5000, kind: 'enter' as const },
      { t: 9000, kind: 'char' as const, correct: true },
      { t: 10_000, kind: 'char' as const, correct: true },
    ]
    const m = computeMetrics(keystrokes, 10_000)
    // 4 correct chars / 5 = 0.8 words over 2s active = 24 wpm
    expect(m.wpm).toBeCloseTo(24)
    // wall-clock seconds still reported for the time stat
    expect(m.seconds).toBe(10)
  })

  it('trailing idle after a completed line does not count against wpm', () => {
    const keystrokes = [
      { t: 0, kind: 'char' as const, correct: true },
      { t: 1000, kind: 'char' as const, correct: true },
      { t: 1200, kind: 'enter' as const },
    ]
    // timer ran 30s more after the enter — active time stays 1s
    const m = computeMetrics(keystrokes, 31_200)
    expect(m.wpm).toBeCloseTo(2 / 5 / (1 / 60))
  })
})
