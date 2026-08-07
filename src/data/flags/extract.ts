import type { CategoryId } from '../types'

/** command separators that start a fresh tool context */
const SEPARATORS = new Set(['|', '||', '&&', ';', 'xargs'])
/** wrappers whose following word is the real tool */
const WRAPPERS = new Set(['sudo', 'nohup', 'time', 'watch'])

export interface FoundFlag {
  /** flag with any =value stripped: `--sort=-%mem` → `--sort` */
  base: string
  /** tool candidates to try for lookup, most specific first */
  tools: string[]
}

// digit-leading tools like `7z` count as words too
const isWord = (t: string) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(t) && !/^\d+$/.test(t)

const isFlagToken = (t: string, category: CategoryId): boolean => {
  if (/^-{1,2}[^\s=-]/.test(t) && t !== '--') return true
  // cmd.exe style switches: /s /im /q — short, no path-like slashes
  if (category === 'cmd' && /^\/[A-Za-z?][A-Za-z-]{0,14}$/.test(t)) return true
  return false
}

/**
 * Find every flag in a command along with the tool candidates it likely
 * belongs to. Splits on pipes/&&/; so each segment resolves against its own
 * tool, skips quoted strings, and offers `tool subcommand` compounds first.
 */
export function extractFlags(text: string, category: CategoryId): FoundFlag[] {
  const tokens = text.split(' ').filter((t) => t.length > 0)
  const found: FoundFlag[] = []
  let segmentWords: string[] = []
  let inQuote: '"' | "'" | null = null

  for (const token of tokens) {
    if (inQuote) {
      for (const ch of token) if (ch === inQuote) inQuote = null
      continue
    }
    const opens = token.match(/["']/)
    if (opens) {
      let open: '"' | "'" | null = null
      for (const ch of token) {
        if (open === null && (ch === '"' || ch === "'")) open = ch
        else if (ch === open) open = null
      }
      inQuote = open
      continue
    }
    if (SEPARATORS.has(token)) {
      segmentWords = []
      continue
    }
    if (isFlagToken(token, category)) {
      const base = token.split('=')[0]
      const words = segmentWords.filter(
        (w, i) => !(i === 0 && WRAPPERS.has(w)) && isWord(w),
      )
      const tools: string[] = []
      // nearest word first (`watch -n 2 free -m` → -m tries free first)
      for (let i = words.length - 1; i >= 0; i--) {
        if (!tools.includes(words[i])) tools.push(words[i])
      }
      if (words.length >= 2) tools.unshift(`${words[0]} ${words[1]}`)
      found.push({ base, tools })
    } else {
      segmentWords.push(token)
    }
  }
  return found
}
