import type { CommandEntry } from '../data/types'
import { shuffleSeeded } from '../lib/rng'
import { chooseClozeToken, type ClozeMask } from './cloze'
import { pickDistractors } from './distractors'
import { commandKey, type MasteryLevel } from './learnStore'

export type QType = 'mc' | 'cloze' | 'recall'

export interface Question {
  key: string
  entry: CommandEntry
  qtype: QType
  /** mc only: shuffled options including the correct entry */
  options?: CommandEntry[]
  correctIndex?: number
  /** cloze only */
  mask?: ClozeMask
}

export const qtypeForLevel = (level: MasteryLevel): QType =>
  level <= 0 ? 'mc' : level === 1 ? 'cloze' : 'recall'

export function buildQuestion(
  entry: CommandEntry,
  level: MasteryLevel,
  pool: CommandEntry[],
  seed: number,
  all?: CommandEntry[],
): [Question, number] {
  const key = commandKey(entry)
  const qtype = qtypeForLevel(level)

  if (qtype === 'mc') {
    const [distractors, s1] = pickDistractors(entry, pool, seed, all)
    const [options, s2] = shuffleSeeded([entry, ...distractors], s1)
    return [
      { key, entry, qtype, options, correctIndex: options.indexOf(entry) },
      s2,
    ]
  }

  if (qtype === 'cloze') {
    const mask = chooseClozeToken(entry.text)
    // un-maskable commands (single token) skip straight to recall
    if (mask) return [{ key, entry, qtype, mask }, seed]
  }

  return [{ key, entry, qtype: 'recall' }, seed]
}
