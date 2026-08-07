/**
 * Pure seeded RNG (mulberry32 step). Every draw returns [value, nextSeed] so
 * reducers can stay deterministic and unit-testable.
 */
export function nextRandom(seed: number): [number, number] {
  const nextSeed = (seed + 0x6d2b79f5) | 0
  let t = nextSeed
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return [value, nextSeed]
}

/** Integer in [0, max). */
export function nextInt(max: number, seed: number): [number, number] {
  const [value, nextSeed] = nextRandom(seed)
  return [Math.floor(value * max), nextSeed]
}

/** Fisher–Yates with threaded seed; input untouched. */
export function shuffleSeeded<T>(arr: readonly T[], seed: number): [T[], number] {
  const out = arr.slice()
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    const [j, nextSeed] = nextInt(i + 1, s)
    s = nextSeed
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return [out, s]
}
