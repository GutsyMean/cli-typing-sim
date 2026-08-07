import type { CategoryId, CommandEntry, Difficulty } from './types'

export function filterPool(
  all: CommandEntry[],
  categories: CategoryId[],
  difficulties: Difficulty[],
): CommandEntry[] {
  const cats = new Set(categories)
  const diffs = new Set(difficulties)
  return all.filter((e) => cats.has(e.category) && diffs.has(e.difficulty))
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface CommandStream {
  next(): CommandEntry
  take(n: number): CommandEntry[]
}

/**
 * Endless dealer over a pool: Fisher–Yates shuffle, deal from the top,
 * reshuffle on exhaustion with a guard against immediate repeats.
 */
export function createCommandStream(pool: CommandEntry[]): CommandStream {
  if (pool.length === 0) throw new Error('command pool is empty')
  let deck = shuffle(pool)
  let index = 0
  let last: CommandEntry | null = null

  const next = (): CommandEntry => {
    if (index >= deck.length) {
      deck = shuffle(pool)
      index = 0
      if (deck.length > 1 && deck[0] === last) {
        const swap = 1 + Math.floor(Math.random() * (deck.length - 1))
        ;[deck[0], deck[swap]] = [deck[swap], deck[0]]
      }
    }
    last = deck[index++]
    return last
  }

  return {
    next,
    take: (n) => Array.from({ length: n }, next),
  }
}
