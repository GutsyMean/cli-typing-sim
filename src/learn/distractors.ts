import { allCommands } from '../data/commands'
import type { CommandEntry } from '../data/types'
import { shuffleSeeded } from '../lib/rng'

/**
 * Pick up to 3 plausible wrong answers for a multiple-choice question.
 * Tiers: same category+difficulty in the study pool → same category in the
 * pool → same category anywhere → anywhere. Deduped by text; the correct
 * text is excluded globally (guards duplicate texts across categories).
 */
export function pickDistractors(
  correct: CommandEntry,
  pool: CommandEntry[],
  seed: number,
  all: CommandEntry[] = allCommands,
): [CommandEntry[], number] {
  const tiers = [
    pool.filter(
      (e) => e.category === correct.category && e.difficulty === correct.difficulty,
    ),
    pool.filter((e) => e.category === correct.category),
    all.filter((e) => e.category === correct.category),
    all,
  ]

  const picked: CommandEntry[] = []
  const used = new Set<string>([correct.text])
  let s = seed
  for (const tier of tiers) {
    if (picked.length >= 3) break
    const [shuffled, nextSeed] = shuffleSeeded(tier, s)
    s = nextSeed
    for (const e of shuffled) {
      if (picked.length >= 3) break
      if (used.has(e.text)) continue
      used.add(e.text)
      picked.push(e)
    }
  }
  return [picked, s]
}
