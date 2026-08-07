/**
 * Regenerates src/data/commands/* and src/data/flags/* from upstream packages:
 *   - command examples: tldr-pages (CC BY 4.0), fetched as the official zip
 *   - flag descriptions: @withfig/autocomplete (ISC), from node_modules
 *
 * Usage: npm run import:data
 * All content comes from upstream; scripts/import-config.mjs only routes
 * tools to categories and fills tldr {{placeholders}}.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { CATEGORY_SOURCES, PLACEHOLDER_RULES } from './import-config.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = join(ROOT, 'scripts', '.cache')
const TLDR_DIR = join(CACHE, 'tldr')
const FIG_BUILD = join(ROOT, 'node_modules', '@withfig', 'autocomplete', 'build')
const TLDR_URL = 'https://github.com/tldr-pages/tldr/releases/latest/download/tldr.zip'

const EXPORT_NAMES = {
  bash: 'bash', git: 'git', docker: 'docker', podman: 'podman',
  kubernetes: 'kubernetes', npm: 'npm', powershell: 'powershell', cmd: 'cmd',
  'ssh-network': 'sshNetwork', vim: 'vim', systemd: 'systemd',
  archives: 'archives', 'text-tools': 'textTools',
  'package-managers': 'packageManagers', cloud: 'cloud',
}
// default page dirs — categories can override (powershell/cmd use windows)
const PAGE_DIRS = ['common', 'linux', 'osx']
const MAX_EXAMPLES_PER_TOOL = 8
const MAX_COMMANDS_PER_CATEGORY = 160
const MAX_FLAGS_PER_TOOL = 25
const MAX_FLAGS_PER_CATEGORY = 350
const MAX_TEXT_LEN = 90

// ---------- helpers ----------

const asciiFy = (s) =>
  s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/ /g, ' ')

const isPrintableAscii = (s) => /^[\x20-\x7E]+$/.test(s)

function ensureTldr() {
  if (existsSync(join(TLDR_DIR, 'pages'))) return
  mkdirSync(CACHE, { recursive: true })
  const zip = join(CACHE, 'tldr.zip')
  if (!existsSync(zip)) {
    console.log('downloading tldr pages…')
    execFileSync('curl', ['-sL', '-o', zip, TLDR_URL], { stdio: 'inherit' })
  }
  mkdirSync(TLDR_DIR, { recursive: true })
  execFileSync('unzip', ['-oq', zip, '-d', TLDR_DIR])
}

// ---------- tldr command extraction ----------

function fillPlaceholder(raw) {
  let p = raw.trim().replace(/\\/g, '/')
  // alternation without brackets: {{now|today|yesterday}} → first choice
  if (p.includes('|')) p = p.split('|')[0].trim()
  // multi-file placeholders: "path/to/file1 path/to/file2 ..."
  if (/\s/.test(p)) {
    if (/file/i.test(p)) return 'a.txt b.txt'
    p = p.split(/\s+/)[0]
  }
  const tryRules = (s) => {
    for (const [re, fill] of PLACEHOLDER_RULES) {
      const m = s.match(re)
      if (m) return typeof fill === 'function' ? fill(m, s) : fill
    }
    return null
  }
  const direct = tryRules(p)
  if (direct !== null) return direct
  // retry with a _name/_names suffix stripped: context_name → context
  const stripped = p.replace(/_names?$/i, '')
  if (stripped !== p) {
    const retried = tryRules(stripped)
    if (retried !== null) return retried
  }
  // fallback: last path segment, cleaned to a plausible literal
  const last = stripped.split('/').pop() ?? stripped
  const cleaned = last.replace(/[^A-Za-z0-9._:=-]/g, '').replace(/_/g, '-')
  return cleaned || 'demo'
}

function cleanCommand(raw) {
  let text = raw
  // {{[-m|--message]}} → -m   and   {{[-m|--message]=value}} handled too
  text = text.replace(/\{\{\[([^\]|]+)\|[^\]]+\]([^}]*)\}\}/g, '$1$2')
  // remaining {{placeholder}}
  text = text.replace(/\{\{([^}]*)\}\}/g, (_, p) => fillPlaceholder(p))
  text = asciiFy(text).replace(/\s+/g, ' ').trim()
  if (text.includes('{{') || text.includes('}}')) return null
  if (!isPrintableAscii(text)) return null
  if (text.length < 2 || text.length > MAX_TEXT_LEN) return null
  // must start with something command-shaped — filters out interactive
  // keybinding docs (<q>, <F>), crontab table syntax (*/10 * * * *), etc.
  const first = text.split(' ')[0]
  if (!/^[A-Za-z0-9][\w.+:@-]*$/.test(first) || /^\d+$/.test(first)) return null
  // keycap notation like <F> or <Space> anywhere means it's not a command
  if (/<[A-Za-z?][A-Za-z]{0,9}>/.test(text)) return null
  return text
}

function cleanDesc(raw) {
  let d = raw.replace(/\[([^\]]+)\]/g, '$1') // [c]reate → create
  d = asciiFy(d).replace(/`([^`]*)`/g, '$1').replace(/\s+/g, ' ').trim()
  d = d.replace(/[.:]+$/, '')
  if (d.length > 1) d = d[0].toLowerCase() + d.slice(1)
  if (!isPrintableAscii(d) || d.length === 0) return null
  if (d.length > 120) {
    d = d.slice(0, 118)
    d = `${d.slice(0, d.lastIndexOf(' '))}...`
  }
  return d
}

function parsePage(path) {
  const lines = readFileSync(path, 'utf8').split('\n')
  const out = []
  let desc = null
  for (const line of lines) {
    if (line.startsWith('- ')) {
      desc = cleanDesc(line.slice(2))
    } else if (line.startsWith('`') && line.endsWith('`') && desc) {
      const text = cleanCommand(line.slice(1, -1))
      if (text) out.push({ text, desc })
      desc = null
    }
  }
  return out
}

function findPages(patterns, dirs = PAGE_DIRS) {
  const files = []
  for (const dir of dirs) {
    const full = join(TLDR_DIR, 'pages', dir)
    if (!existsSync(full)) continue
    const names = readdirSync(full)
    for (const pattern of patterns) {
      if (pattern.endsWith('-*')) {
        const prefix = pattern.slice(0, -1)
        for (const n of names) {
          if (n.startsWith(prefix) && n.endsWith('.md')) files.push(join(full, n))
        }
      } else if (names.includes(`${pattern}.md`)) {
        files.push(join(full, `${pattern}.md`))
      }
    }
  }
  return [...new Set(files)]
}

const countFlags = (text) => (text.match(/(^|\s)-{1,2}[A-Za-z0-9]/g) ?? []).length

function difficultyFor(text) {
  const score = text.length + countFlags(text) * 8
  return score <= 30 ? 1 : score <= 62 ? 2 : 3
}

function importCommands(categoryId, sources) {
  const entries = []
  const seen = new Set()
  for (const page of findPages(sources.tldr, sources.dirs)) {
    let fromTool = 0
    for (const { text, desc } of parsePage(page)) {
      if (fromTool >= MAX_EXAMPLES_PER_TOOL) break
      if (seen.has(text)) continue
      seen.add(text)
      entries.push({ text, category: categoryId, difficulty: difficultyFor(text), desc })
      fromTool++
    }
  }
  entries.sort((a, b) => a.text.localeCompare(b.text))
  return entries.slice(0, MAX_COMMANDS_PER_CATEGORY)
}

// ---------- fig flag extraction ----------

function optionNames(name) {
  const names = (Array.isArray(name) ? name : [name]).filter(
    (n) => typeof n === 'string' && n.startsWith('-'),
  )
  const shorts = names.filter((n) => !n.startsWith('--')).sort((a, b) => a.length - b.length)
  const longs = names.filter((n) => n.startsWith('--')).sort((a, b) => a.length - b.length)
  const primary = shorts[0] ?? longs[0]
  const alt = primary === shorts[0] ? longs[0] : undefined
  return { primary, alt }
}

function cleanFlagDesc(raw) {
  if (typeof raw !== 'string') return null
  let d = asciiFy(raw).split('\n')[0].replace(/\s+/g, ' ').trim()
  if (!isPrintableAscii(d) || d.length === 0) return null
  if (d.length > 150) d = `${d.slice(0, 147)}...`
  return d
}

function collectOptions(spec, toolPath, sink, depth) {
  for (const opt of spec.options ?? []) {
    if (opt.hidden || opt.deprecated) continue
    const { primary, alt } = optionNames(opt.name)
    if (!primary || primary === '-' || primary === '--') continue
    const desc = cleanFlagDesc(opt.description)
    if (!desc) continue
    const flag = primary.split('=')[0]
    sink.push({
      tool: toolPath,
      flag,
      desc: alt ? `${desc} (also ${alt})` : desc,
      hasBoth: !!alt,
    })
  }
  if (depth >= 2) return
  const root = toolPath.split(' ')[0]
  for (const sub of spec.subcommands ?? []) {
    const name = Array.isArray(sub.name) ? sub.name[0] : sub.name
    if (typeof name !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)) continue
    const subPath = depth === 0 ? `${root} ${name}` : toolPath
    collectOptions(sub, subPath, sink, depth + 1)
  }
}

async function importFlags(categoryId, sources) {
  const raw = []
  for (const tool of sources.fig) {
    const file = join(FIG_BUILD, `${tool}.js`)
    if (!existsSync(file)) {
      console.warn(`  (no fig spec for ${tool})`)
      continue
    }
    const mod = await import(pathToFileURL(file).href)
    const spec = mod.default
    if (!spec) continue
    const sink = []
    collectOptions(spec, tool, sink, 0)
    // prefer well-documented options: both forms first, then shorter flags
    const byTool = new Map()
    for (const o of sink) {
      const list = byTool.get(o.tool) ?? []
      list.push(o)
      byTool.set(o.tool, list)
    }
    for (const [, list] of byTool) {
      list.sort(
        (a, b) =>
          Number(b.hasBoth) - Number(a.hasBoth) || a.flag.length - b.flag.length,
      )
      raw.push(...list.slice(0, MAX_FLAGS_PER_TOOL))
    }
  }
  const seen = new Set()
  let entries = []
  for (const o of raw) {
    const key = `${o.tool} ${o.flag}`
    if (seen.has(key)) continue
    seen.add(key)
    const difficulty =
      o.flag.length > 15 ? 3 : o.flag.startsWith('--') ? 2 : 1
    entries.push({
      tool: o.tool,
      flag: o.flag,
      desc: o.desc,
      category: categoryId,
      difficulty,
      hasBoth: o.hasBoth,
    })
  }
  // keep the best-documented flags first when trimming to the category cap
  entries.sort(
    (a, b) =>
      Number(b.hasBoth) - Number(a.hasBoth) ||
      a.flag.length - b.flag.length ||
      a.tool.localeCompare(b.tool),
  )
  entries = entries.slice(0, MAX_FLAGS_PER_CATEGORY)
  entries.sort((a, b) => a.tool.localeCompare(b.tool) || a.flag.localeCompare(b.flag))
  return entries.map(({ hasBoth: _hasBoth, ...e }) => e)
}

// ---------- coverage (mirrors src/data/flags/extract.ts) ----------

const SEPARATORS = new Set(['|', '||', '&&', ';', 'xargs'])
const WRAPPERS = new Set(['sudo', 'nohup', 'time', 'watch'])
const isWord = (t) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(t) && !/^\d+$/.test(t)
const isFlagToken = (t, category) => {
  if (/^-{1,2}[^\s=-]/.test(t) && t !== '--') return true
  if (category === 'cmd' && /^\/[A-Za-z?][A-Za-z-]{0,14}$/.test(t)) return true
  return false
}

function extractFlagsMirror(text, category) {
  const tokens = text.split(' ').filter((t) => t.length > 0)
  const found = []
  let segmentWords = []
  let inQuote = null
  for (const token of tokens) {
    if (inQuote) {
      for (const ch of token) if (ch === inQuote) inQuote = null
      continue
    }
    if (/["']/.test(token)) {
      let open = null
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
      const words = segmentWords.filter((w, i) => !(i === 0 && WRAPPERS.has(w)) && isWord(w))
      const tools = []
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

function computeExceptions(commands, flags, categoryId) {
  const lookup = new Set(flags.map((f) => `${f.tool} ${f.flag}`))
  const exceptions = []
  for (const entry of commands) {
    for (const f of extractFlagsMirror(entry.text, categoryId)) {
      const resolved = f.tools.some((t) => lookup.has(`${t} ${f.base}`))
      if (!resolved) exceptions.push(`${entry.text} :: ${f.base}`)
    }
  }
  return [...new Set(exceptions)]
}

// ---------- emit ----------

const q = (s) => JSON.stringify(s)

function emitCommands(categoryId, entries) {
  const name = EXPORT_NAMES[categoryId]
  const rows = entries
    .map(
      (e) =>
        `  { text: ${q(e.text)}, category: ${q(e.category)}, difficulty: ${e.difficulty}, desc: ${q(e.desc)} },`,
    )
    .join('\n')
  return `/**
 * GENERATED FILE — do not edit by hand. Regenerate with: npm run import:data
 * Command examples imported from tldr-pages (https://github.com/tldr-pages/tldr),
 * licensed CC BY 4.0.
 */
import type { CommandEntry } from '../types'

export const ${name}: CommandEntry[] = [
${rows}
]
`
}

function emitFlags(categoryId, flags, exceptions) {
  const rows = flags
    .map(
      (f) =>
        `  { tool: ${q(f.tool)}, flag: ${q(f.flag)}, desc: ${q(f.desc)}, category: ${q(f.category)}, difficulty: ${f.difficulty} },`,
    )
    .join('\n')
  const exRows = exceptions.map((e) => `  ${q(e)},`).join('\n')
  return `/**
 * GENERATED FILE — do not edit by hand. Regenerate with: npm run import:data
 * Flag descriptions imported from @withfig/autocomplete
 * (https://github.com/withfig/autocomplete), licensed ISC.
 */
import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
${rows}
]

/** command flags with no upstream description (auto-generated) */
export const coverageExceptions: string[] = [
${exRows}
]
`
}

// ---------- main ----------

ensureTldr()
let totalCommands = 0
let totalFlags = 0
for (const [categoryId, sources] of Object.entries(CATEGORY_SOURCES)) {
  const commands = importCommands(categoryId, sources)
  const flags = await importFlags(categoryId, sources)
  const exceptions = computeExceptions(commands, flags, categoryId)
  writeFileSync(
    join(ROOT, 'src', 'data', 'commands', `${categoryId}.ts`),
    emitCommands(categoryId, commands),
  )
  writeFileSync(
    join(ROOT, 'src', 'data', 'flags', `${categoryId}.ts`),
    emitFlags(categoryId, flags, exceptions),
  )
  const tiers = [1, 2, 3].map((d) => commands.filter((c) => c.difficulty === d).length)
  console.log(
    `${categoryId.padEnd(18)} commands ${String(commands.length).padStart(3)} (${tiers.join('/')})  flags ${String(flags.length).padStart(3)}  exceptions ${exceptions.length}`,
  )
  totalCommands += commands.length
  totalFlags += flags.length
}
console.log(`\ntotal: ${totalCommands} commands, ${totalFlags} flags`)
