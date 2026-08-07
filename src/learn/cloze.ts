export interface ClozeMask {
  start: number
  length: number
  token: string
}

interface Token {
  text: string
  start: number
  index: number
}

const OPERATORS = new Set([
  '|', '||', '&&', ';', '&', '>', '>>', '<', '<<', '2>&1', '2>', '1>', '#',
])

/**
 * Split on single spaces (data invariant: no runs), merging tokens so an
 * opening quote extends through its close.
 */
export function tokenize(text: string): Token[] {
  const rough: Token[] = []
  let start = 0
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text[i] === ' ') {
      if (i > start) rough.push({ text: text.slice(start, i), start, index: 0 })
      start = i + 1
    }
  }

  const merged: Token[] = []
  let open: '"' | "'" | null = null
  for (const tok of rough) {
    if (open === null) {
      merged.push({ ...tok })
      open = unclosedQuote(tok.text)
    } else {
      const last = merged[merged.length - 1]
      last.text = `${last.text} ${tok.text}`
      open = unclosedQuote(last.text)
    }
  }
  merged.forEach((t, i) => (t.index = i))
  return merged
}

function unclosedQuote(text: string): '"' | "'" | null {
  let open: '"' | "'" | null = null
  for (const ch of text) {
    if (open === null && (ch === '"' || ch === "'")) open = ch
    else if (ch === open) open = null
  }
  return open
}

/**
 * Pick the most instructive token to mask: prefer the longest flag, then the
 * subcommand (token 1), then the longest remaining candidate. Never the first
 * token, never operators/redirects, never quoted strings.
 */
export function chooseClozeToken(text: string): ClozeMask | null {
  const tokens = tokenize(text)
  const candidates = tokens.filter(
    (t) =>
      t.index >= 1 &&
      !OPERATORS.has(t.text) &&
      !t.text.includes('"') &&
      !t.text.includes("'"),
  )
  if (candidates.length === 0) return null

  const flags = candidates.filter((t) => t.text.startsWith('-'))
  let pick: Token
  if (flags.length > 0) {
    pick = flags.reduce((a, b) => (b.text.length > a.text.length ? b : a))
  } else {
    const sub = candidates.find((t) => t.index === 1)
    pick = sub ?? candidates.reduce((a, b) => (b.text.length > a.text.length ? b : a))
  }
  return { start: pick.start, length: pick.text.length, token: pick.text }
}
