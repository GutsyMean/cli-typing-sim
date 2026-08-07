import type { CharStatus } from '../engine/typingReducer'

export interface AnswerDiff {
  /** one status per char of the expected command */
  statuses: CharStatus[]
  /** typed overflow beyond the expected length */
  extra: string
}

/** Char-level comparison of a typed answer against the expected command. */
export function diffStatuses(typed: string, expected: string): AnswerDiff {
  const statuses: CharStatus[] = []
  for (let i = 0; i < expected.length; i++) {
    statuses.push(
      i >= typed.length ? 'pending' : typed[i] === expected[i] ? 'correct' : 'incorrect',
    )
  }
  return { statuses, extra: typed.slice(expected.length) }
}

/** Whitespace-tolerant equality for full-recall answers. */
export const normalizeAnswer = (s: string): string => s.trim().replace(/ +/g, ' ')
