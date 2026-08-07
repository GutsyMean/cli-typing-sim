import type { CategoryId } from '../data/types'
import type { KeystrokeEvent } from './typingReducer'

export interface SecondBin {
  sec: number
  /** raw wpm for this second */
  raw: number
  /** rolling-smoothed wpm for display */
  smooth: number
  errors: number
}

export interface TestMetrics {
  wpm: number
  raw: number
  accuracy: number
  consistency: number
  /** actual elapsed seconds */
  seconds: number
  correctChars: number
  totalChars: number
  errorCount: number
  bins: SecondBin[]
  missedChars: { char: string; count: number }[]
  categoryErrors: { category: CategoryId; errors: number; total: number }[]
}

/**
 * Time actually spent typing: the pauses around line boundaries — after the
 * last char of a command (pre-enter) and before the first char of the next
 * one (post-enter) — don't count against WPM.
 */
export function activeTypingMs(
  keystrokes: KeystrokeEvent[],
  elapsedMs: number,
): number {
  if (keystrokes.length === 0) return elapsedMs
  let active = 0
  for (let i = 1; i < keystrokes.length; i++) {
    const prev = keystrokes[i - 1]
    const k = keystrokes[i]
    if (prev.kind !== 'enter' && k.kind !== 'enter') active += k.t - prev.t
  }
  const last = keystrokes[keystrokes.length - 1]
  if (last.kind !== 'enter') active += Math.max(0, elapsedMs - last.t)
  return Math.min(active, elapsedMs)
}

export function computeMetrics(
  keystrokes: KeystrokeEvent[],
  elapsedMs: number,
): TestMetrics {
  const activeMs = activeTypingMs(keystrokes, elapsedMs)
  const minutes = Math.max(activeMs / 60000, 1 / 600)
  const seconds = elapsedMs / 1000

  let correctChars = 0
  let totalChars = 0
  const missed = new Map<string, number>()
  const catErr = new Map<CategoryId, { errors: number; total: number }>()

  for (const k of keystrokes) {
    if (k.kind !== 'char') continue
    totalChars++
    if (k.correct) correctChars++
    if (k.category) {
      const c = catErr.get(k.category) ?? { errors: 0, total: 0 }
      c.total++
      if (!k.correct) c.errors++
      catErr.set(k.category, c)
    }
    if (!k.correct && k.expected) {
      missed.set(k.expected, (missed.get(k.expected) ?? 0) + 1)
    }
  }

  const errorCount = totalChars - correctChars
  const wpm = correctChars / 5 / minutes
  const raw = totalChars / 5 / minutes
  const accuracy = totalChars === 0 ? 100 : (correctChars / totalChars) * 100

  // Per-second bins over the full test duration.
  const binCount = Math.max(1, Math.ceil(seconds))
  const bins: SecondBin[] = Array.from({ length: binCount }, (_, i) => ({
    sec: i + 1,
    raw: 0,
    smooth: 0,
    errors: 0,
  }))
  for (const k of keystrokes) {
    if (k.kind !== 'char') continue
    const i = Math.min(binCount - 1, Math.floor(k.t / 1000))
    bins[i].raw += 12 // one char = 1/5 word per second = 12 wpm
    if (!k.correct) bins[i].errors++
  }
  for (let i = 0; i < binCount; i++) {
    let sum = 0
    let n = 0
    for (let j = Math.max(0, i - 1); j <= Math.min(binCount - 1, i + 1); j++) {
      sum += bins[j].raw
      n++
    }
    bins[i].smooth = sum / n
  }

  // Consistency: 100 × (1 − CV) over raw per-second wpm, skipping the
  // first bin (ramp-up) when there are enough bins.
  const sample = (binCount > 2 ? bins.slice(1) : bins).map((b) => b.raw)
  const mean = sample.reduce((a, b) => a + b, 0) / sample.length
  let consistency = 0
  if (mean > 0) {
    const variance =
      sample.reduce((a, b) => a + (b - mean) ** 2, 0) / sample.length
    const cv = Math.sqrt(variance) / mean
    consistency = Math.max(0, Math.min(100, 100 * (1 - cv)))
  }

  const missedChars = [...missed.entries()]
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const categoryErrors = [...catErr.entries()]
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.errors - a.errors)

  return {
    wpm,
    raw,
    accuracy,
    consistency,
    seconds,
    correctChars,
    totalChars,
    errorCount,
    bins,
    missedChars,
    categoryErrors,
  }
}
