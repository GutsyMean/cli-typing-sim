import type { CommandEntry } from '../data/types'
import { shuffleSeeded } from '../lib/rng'
import { chooseClozeToken, type ClozeMask } from './cloze'
import { pickDistractors } from './distractors'
import { commandKey, type MasteryLevel } from './learnStore'

export type QType = 'mc' | 'cloze' | 'recall'

export interface Question {
  key: string
  /** unique per built question instance — stable React key across phases */
  uid: number
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
  uid: number,
  all?: CommandEntry[],
): [Question, number] {
  const key = commandKey(entry)
  const qtype = qtypeForLevel(level)

  if (qtype === 'mc') {
    const [distractors, s1] = pickDistractors(entry, pool, seed, all)
    const [options, s2] = shuffleSeeded([entry, ...distractors], s1)
    return [
      { key, uid, entry, qtype, options, correctIndex: options.indexOf(entry) },
      s2,
    ]
  }

  if (qtype === 'cloze') {
    const mask = chooseClozeToken(entry.text)
    // un-maskable commands (fully quoted) skip straight to recall
    if (mask) return [{ key, uid, entry, qtype, mask }, seed]
  }

  return [{ key, uid, entry, qtype: 'recall' }, seed]
}
