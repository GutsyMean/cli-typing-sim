# termtype

Muscle memory for the command line. A [monkeytype](https://monkeytype.com)-style
typing trainer for **real CLI commands**, rendered as a simulated terminal.

![termtype](public/terminal.svg)

## Features

- **~1,900 real commands** across 15 categories — bash, git, docker, podman,
  kubectl, npm, PowerShell, cmd.exe, ssh & networking, vim, systemd, archives,
  text tools (grep/sed/awk/jq), package managers, and cloud CLIs — in 3
  difficulty tiers from `ls -la` to flag-heavy one-liners.
- **Terminal-native test flow** — every command sits on its own prompt line
  (`dev@local:~/projects$`, `PS C:\Users\dev>`, …); press Enter to "run" it and
  get the next prompt. Prompts can auto-match each command's native shell.
- **Monkeytype-style feedback** — per-character coloring, spring-animated
  caret (block/line/underscore), live WPM, caps-lock warning, `esc` or
  `tab+enter` to restart, timer starts on your first keystroke.
- **Deep configuration** — timed sprints (15/30/60/120s) or command counts
  (10/25/50), category multi-select, difficulty tiers, forgiving vs.
  stop-on-error, 8 terminal themes (dracula, nord, gruvbox, solarized,
  catppuccin, CRT green, paper…), font sizes, synthesized key sounds, and more.
- **Results that teach** — WPM / raw / accuracy / consistency, a per-second
  WPM chart with error markers, most-missed keys, per-category accuracy, and a
  progress graph persisted in localStorage.
- **Learn mode** — a Quizlet-style mastery ladder in the mode selector: each
  command climbs from multiple choice → fill-in-the-blank → full recall from
  its description alone. Wrong answers stay on screen until you continue, and
  wrong recalls show a character diff and make you copy-type the real command
  once. Mastery persists, and the home screen shows your learning progress per
  category with recently-mastered and needs-work lists.
- **Flag-level learning** — a ~3,200-entry flag glossary. After each answered
  command a flag breakdown explains what its flags do, and the study selector
  (commands / flags / both) adds a flag ladder: pick the flag from its meaning
  → pick the meaning of a flag → type the flag from memory.

## Data pipeline

All content is imported from upstream packages — nothing is hand-written:

- **Command examples**: [tldr-pages](https://github.com/tldr-pages/tldr)
  (CC BY 4.0), fetched as the official release archive; `{{placeholders}}`
  are filled with realistic values.
- **Flag descriptions**: [@withfig/autocomplete](https://github.com/withfig/autocomplete)
  (ISC), read from the npm package.

Regenerate after an upstream update with:

```sh
npm update @withfig/autocomplete
rm -rf scripts/.cache   # re-fetch the latest tldr archive
npm run import:data
npx vitest run          # invariant tests gate the imported data
```

`scripts/import-config.mjs` only routes tools to categories and fills
placeholders; the generated files in `src/data/commands/` and
`src/data/flags/` are never edited by hand.

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · [Motion](https://motion.dev)
(`motion/react`) · zustand · vitest. Fonts: Google Sans Code (terminal) and
Outfit (UI) from Google Fonts.

## Develop

```sh
npm install
npm run dev      # local dev server
npx vitest run   # engine + data-invariant tests
npm run build    # production build in dist/
```

## Deploy

Static SPA — no backend. Connect the repo to Vercel or Netlify; the defaults
(`npm run build`, output `dist/`) just work.
