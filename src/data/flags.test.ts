import { describe, expect, it } from 'vitest'
import { allCommands, categories } from './commands'
import { allFlags, coverageExceptions, extractFlags, findFlag } from './flags'

describe('flag glossary invariants', () => {
  it('entries are well-formed', () => {
    for (const f of allFlags) {
      expect(f.flag, `${f.tool} ${f.flag}`).toMatch(/^(-{1,2}[^\s=]+|\/[A-Za-z?][A-Za-z-]*)$/)
      expect(f.flag.includes('='), `${f.tool} ${f.flag} must not include =value`).toBe(false)
      expect(f.tool.length).toBeGreaterThan(0)
      expect(f.desc.length).toBeGreaterThan(0)
      expect(f.desc, `${f.tool} ${f.flag}`).toBe(f.desc.trim())
    }
  })

  it('has no duplicate tool+flag within a category', () => {
    const seen = new Set<string>()
    for (const f of allFlags) {
      const key = `${f.category}:${f.tool}:${f.flag}`
      expect(seen.has(key), key).toBe(false)
      seen.add(key)
    }
  })

  describe('every flag used in the command datasets is explained', () => {
    it.each(categories.map((c) => [c.id] as const))('%s', (categoryId) => {
      const missing: string[] = []
      for (const entry of allCommands.filter((e) => e.category === categoryId)) {
        for (const f of extractFlags(entry.text, categoryId)) {
          const exception = `${entry.text} :: ${f.base}`
          if (coverageExceptions.has(exception)) continue
          if (!findFlag(categoryId, f.tools, f.base)) {
            missing.push(exception)
          }
        }
      }
      expect(missing, `add glossary entries (or exceptions) for:\n${missing.join('\n')}`).toEqual([])
    })
  })

  it('each category with flags has a reasonable spread', () => {
    for (const cat of categories) {
      const inCat = allFlags.filter((f) => f.category === cat.id)
      // every category's commands use flags, so every glossary must have some
      expect(inCat.length, `category ${cat.id}`).toBeGreaterThanOrEqual(10)
    }
  })
})
