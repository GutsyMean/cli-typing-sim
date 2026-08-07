import { allFlags, type FlagEntry } from '../data/flags'
import type { CommandEntry } from '../data/types'
import { shuffleSeeded } from '../lib/rng'
import { chooseClozeToken, type ClozeMask } from './cloze'
import { pickDistractors } from './distractors'
import type { MasteryLevel } from './learnStore'
import { studyKey, type StudyItem } from './studyItems'

export type QType = 'mc' | 'cloze' | 'recall' | 'flag-mc' | 'flag-which' | 'flag-recall'

export interface Question {
  key: string
  /** unique per built question instance — stable React key across phases */
  uid: number
  item: StudyItem
  qtype: QType
  /** the `# …` context line above the question */
  comment: string
  /** mc-family only */
  options?: string[]
  correctIndex?: number
  /** command cloze only */
  mask?: ClozeMask
  /** target for typed answers: cloze token, full command, or the flag */
  answer?: string
}

export const qtypeForItem = (item: StudyItem, level: MasteryLevel): QType => {
  if (item.kind === 'command') {
    return level <= 0 ? 'mc' : level === 1 ? 'cloze' : 'recall'
  }
  return level <= 0 ? 'flag-mc' : level === 1 ? 'flag-which' : 'flag-recall'
}

/** flag distractors: same tool → same category → anywhere, deduped */
function pickFlagDistractors(
  correct: FlagEntry,
  flagPool: FlagEntry[],
  seed: number,
  all: FlagEntry[],
): [FlagEntry[], number] {
  const tiers = [
    flagPool.filter((f) => f.tool === correct.tool),
    flagPool.filter((f) => f.category === correct.category),
    all.filter((f) => f.category === correct.category),
    all,
  ]
  const picked: FlagEntry[] = []
  const usedFlags = new Set<string>([correct.flag])
  const usedDescs = new Set<string>([correct.desc])
  let s = seed
  for (const tier of tiers) {
    if (picked.length >= 3) break
    const [shuffled, nextSeed] = shuffleSeeded(tier, s)
    s = nextSeed
    for (const f of shuffled) {
      if (picked.length >= 3) break
      if (usedFlags.has(f.flag) || usedDescs.has(f.desc)) continue
      usedFlags.add(f.flag)
      usedDescs.add(f.desc)
      picked.push(f)
    }
  }
  return [picked, s]
}

export interface QuestionPools {
  commands: CommandEntry[]
  flags: FlagEntry[]
}

export function buildQuestion(
  item: StudyItem,
  level: MasteryLevel,
  pools: QuestionPools,
  seed: number,
  uid: number,
  allFlagEntries: FlagEntry[] = allFlags,
): [Question, number] {
  const key = studyKey(item)
  const qtype = qtypeForItem(item, level)

  if (item.kind === 'command') {
    const entry = item.entry
    const comment = entry.desc

    if (qtype === 'mc') {
      const [distractors, s1] = pickDistractors(entry, pools.commands, seed)
      const [shuffledEntries, s2] = shuffleSeeded([entry, ...distractors], s1)
      const options = shuffledEntries.map((e) => e.text)
      return [
        { key, uid, item, qtype, comment, options, correctIndex: options.indexOf(entry.text) },
        s2,
      ]
    }

    if (qtype === 'cloze') {
      const mask = chooseClozeToken(entry.text)
      // un-maskable commands (fully quoted) skip straight to recall
      if (mask) {
        return [{ key, uid, item, qtype, comment, mask, answer: mask.token }, seed]
      }
    }

    return [{ key, uid, item, qtype: 'recall', comment, answer: entry.text }, seed]
  }

  const flag = item.flag
  if (qtype === 'flag-mc') {
    // description → pick the flag
    const comment = `${flag.tool}: ${flag.desc}`
    const [distractors, s1] = pickFlagDistractors(flag, pools.flags, seed, allFlagEntries)
    const [shuffled, s2] = shuffleSeeded([flag, ...distractors], s1)
    const options = shuffled.map((f) => f.flag)
    return [
      { key, uid, item, qtype, comment, options, correctIndex: options.indexOf(flag.flag) },
      s2,
    ]
  }

  if (qtype === 'flag-which') {
    // flag → pick its meaning
    const comment = `what does ${flag.flag} do in ${flag.tool}?`
    const [distractors, s1] = pickFlagDistractors(flag, pools.flags, seed, allFlagEntries)
    const [shuffled, s2] = shuffleSeeded([flag, ...distractors], s1)
    const options = shuffled.map((f) => f.desc)
    return [
      { key, uid, item, qtype, comment, options, correctIndex: options.indexOf(flag.desc) },
      s2,
    ]
  }

  // flag-recall: description → type the flag
  return [
    {
      key,
      uid,
      item,
      qtype: 'flag-recall',
      comment: `${flag.tool}: ${flag.desc} — type the flag`,
      answer: flag.flag,
    },
    seed,
  ]
}
