import { describe, expect, it } from 'vitest'
import { allCommands, categories } from './commands'
import { createCommandStream, filterPool } from './generator'

describe('command data invariants', () => {
  it('has entries for every category', () => {
    for (const cat of categories) {
      const entries = allCommands.filter((e) => e.category === cat.id)
      expect(entries.length, `category ${cat.id}`).toBeGreaterThanOrEqual(30)
      for (const tier of [1, 2, 3] as const) {
        const inTier = entries.filter((e) => e.difficulty === tier)
        expect(inTier.length, `category ${cat.id} tier ${tier}`).toBeGreaterThanOrEqual(8)
      }
    }
  })

  it('every command is single-line printable ASCII, trimmed, no tabs, <= 90 chars', () => {
    for (const e of allCommands) {
      expect(e.text, e.text).toMatch(/^[\x20-\x7E]+$/)
      expect(e.text, e.text).toBe(e.text.trim())
      expect(e.text.includes('\t'), e.text).toBe(false)
      expect(e.text.length, e.text).toBeLessThanOrEqual(90)
      expect(e.text.length).toBeGreaterThan(0)
      expect(e.desc.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate command texts within a category', () => {
    const seen = new Set<string>()
    for (const e of allCommands) {
      const key = `${e.category}:${e.text}`
      expect(seen.has(key), key).toBe(false)
      seen.add(key)
    }
  })
})

describe('generator', () => {
  it('filters by category and difficulty', () => {
    const pool = filterPool(allCommands, ['bash'], [1])
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((e) => e.category === 'bash' && e.difficulty === 1)).toBe(true)
  })

  it('deals every entry once before repeating, never twice in a row', () => {
    const pool = filterPool(allCommands, ['bash'], [1, 2, 3])
    const stream = createCommandStream(pool)
    const firstPass = stream.take(pool.length)
    expect(new Set(firstPass).size).toBe(pool.length)
    let prev = firstPass[firstPass.length - 1]
    for (let i = 0; i < pool.length * 3; i++) {
      const next = stream.next()
      expect(next).not.toBe(prev)
      prev = next
    }
  })

  it('throws on an empty pool', () => {
    expect(() => createCommandStream([])).toThrow()
  })
})
