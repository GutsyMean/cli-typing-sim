import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  { tool: 'vim', flag: '-O', desc: 'open files side by side in vertical splits', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-o', desc: 'open files in stacked horizontal splits', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-p', desc: 'open each file in its own tab page', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-d', desc: 'start in diff mode, comparing the given files', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-R', desc: 'open the file read-only', category: 'vim', difficulty: 1 },
  { tool: 'vim', flag: '-c', desc: 'run an ex command after loading the file', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-u', desc: 'use the given vimrc, or none to skip all config', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '-N', desc: 'nocompatible mode: full vim behavior even without a vimrc', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '-es', desc: 'silent ex mode for non-interactive batch editing', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '-r', desc: 'recover a file from its swap file after a crash', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '-n', desc: 'do not use a swap file', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '-m', desc: 'open with modifications disallowed: writing files is off', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '-S', desc: 'source a session or script file after loading', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '--noplugin', desc: 'skip loading plugins', category: 'vim', difficulty: 3 },
  { tool: 'vim', flag: '--clean', desc: 'start without any personal config or plugins', category: 'vim', difficulty: 2 },
  { tool: 'vim', flag: '--version', desc: 'print version and feature information', category: 'vim', difficulty: 1 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
