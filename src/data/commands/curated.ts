/**
 * HAND-CURATED supplements — edit freely. These cover areas the upstream
 * packages don't: vim ex-mode commands aren't documented by tldr-pages.
 * Merged with the imported data by commands/index.ts; the duplicate and
 * invariant tests guard collisions with imported entries.
 */
import type { CommandEntry } from '../types'

export const curatedCommands: CommandEntry[] = [
  { text: ":w", category: "vim", difficulty: 1, desc: "save the current file" },
  { text: ":q", category: "vim", difficulty: 1, desc: "quit the current window" },
  { text: ":wq", category: "vim", difficulty: 1, desc: "save and quit" },
  { text: ":q!", category: "vim", difficulty: 1, desc: "quit and throw away unsaved changes" },
  { text: ":x", category: "vim", difficulty: 1, desc: "save only if changed, then quit" },
  { text: ":help", category: "vim", difficulty: 1, desc: "open the built-in documentation" },
  { text: ":set number", category: "vim", difficulty: 1, desc: "show line numbers" },
  { text: ":syntax on", category: "vim", difficulty: 1, desc: "turn on syntax highlighting" },
  { text: ":noh", category: "vim", difficulty: 1, desc: "clear the current search highlight" },
  { text: ":e config.yml", category: "vim", difficulty: 1, desc: "open another file for editing" },
  { text: ":w backup.txt", category: "vim", difficulty: 1, desc: "write the buffer to a different file" },
  { text: ":sp notes.txt", category: "vim", difficulty: 1, desc: "open a file in a horizontal split" },
  { text: ":ls", category: "vim", difficulty: 1, desc: "list the open buffers" },
  { text: ":bn", category: "vim", difficulty: 1, desc: "switch to the next buffer" },
  { text: "vim README.md", category: "vim", difficulty: 1, desc: "open a file in vim" },
  { text: "vim +25 main.c", category: "vim", difficulty: 1, desc: "open a file with the cursor on line 25" },
  { text: ":%s/foo/bar/g", category: "vim", difficulty: 2, desc: "replace every foo with bar in the whole file" },
  { text: ":s/old/new/", category: "vim", difficulty: 2, desc: "replace the first match on the current line" },
  { text: ":g/TODO/d", category: "vim", difficulty: 2, desc: "delete every line containing todo" },
  { text: ":set expandtab shiftwidth=2", category: "vim", difficulty: 2, desc: "indent with two spaces instead of tabs" },
  { text: ":set ignorecase smartcase", category: "vim", difficulty: 2, desc: "case-insensitive search unless you type capitals" },
  { text: ":vsplit src/app.ts", category: "vim", difficulty: 2, desc: "open a file in a vertical split" },
  { text: ":tabnew notes.md", category: "vim", difficulty: 2, desc: "open a file in a new tab" },
  { text: ":e!", category: "vim", difficulty: 2, desc: "reload the file, discarding unsaved edits" },
  { text: ":r !date", category: "vim", difficulty: 2, desc: "insert the output of a shell command" },
  { text: ":w !sudo tee %", category: "vim", difficulty: 2, desc: "save a root-owned file you opened without sudo" },
  { text: ":bd 3", category: "vim", difficulty: 2, desc: "close buffer number three" },
  { text: ":sort u", category: "vim", difficulty: 2, desc: "sort all lines and drop duplicates" },
  { text: ":args *.md", category: "vim", difficulty: 2, desc: "load every markdown file into the argument list" },
  { text: ":marks", category: "vim", difficulty: 2, desc: "list the marks set in this session" },
  { text: "vim -O a.txt b.txt", category: "vim", difficulty: 2, desc: "open two files side by side" },
  { text: "vim -d old.conf new.conf", category: "vim", difficulty: 2, desc: "diff two files in vim" },
  { text: ":%s/\\<count\\>/total/gc", category: "vim", difficulty: 3, desc: "whole-word replace, confirming each change" },
  { text: ":g/^\\s*$/d", category: "vim", difficulty: 3, desc: "delete every blank or whitespace-only line" },
  { text: ":v/error/d", category: "vim", difficulty: 3, desc: "keep only the lines that mention error" },
  { text: ":%s/\\(\\w\\+\\), \\(\\w\\+\\)/\\2 \\1/g", category: "vim", difficulty: 3, desc: "swap last, first names using capture groups" },
  { text: ":%s/\\s\\+$//e", category: "vim", difficulty: 3, desc: "strip trailing whitespace, no error if none" },
  { text: ":bufdo %s/http:/https:/ge | update", category: "vim", difficulty: 3, desc: "upgrade urls in every buffer and save changed ones" },
  { text: ":10,25s/^/# /", category: "vim", difficulty: 3, desc: "comment out lines 10 through 25" },
  { text: ":autocmd BufWritePre *.py :%s/\\s\\+$//e", category: "vim", difficulty: 3, desc: "auto-strip trailing whitespace when saving python" },
  { text: ":set statusline=%f\\ %y\\ %l:%c", category: "vim", difficulty: 3, desc: "status line with file, type, and cursor position" },
  { text: ":windo diffthis", category: "vim", difficulty: 3, desc: "diff all the windows you already have open" },
]
