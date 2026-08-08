# termtype — product truth

## What it is
A web-based typing trainer for the command line. Users practice typing real
CLI commands (monkeytype-style, per-character feedback inside a simulated
terminal) and learn commands and their flags through a Quizlet-style mastery
ladder. Content is imported from tldr-pages and @withfig/autocomplete.

## Audience & scene
Developers, sysadmins, and students who live in terminals and want faster,
more accurate command-line muscle memory. Used in short sessions at a desk —
usually alongside an editor/terminal, often in the evening; predominantly a
keyboard-first, desktop experience. Dark ambient environments dominate.

## Jobs
1. Practice: timed / fixed-count / endless typing tests over real commands,
   with WPM, accuracy, consistency and per-second charts.
2. Learn: multiple choice → fill-in-the-blank → full recall mastery ladder
   for commands and flags, with persistent progress.
3. Configure: pick categories (bash, git, docker, kubectl, PowerShell, …),
   difficulty tiers, themes, prompt styles, caret, behavior.

## Surfaces (all Operate mode)
- Home: configuration dashboard + learn-progress overview. The main surface.
- Test: the live typing terminal. Results: metrics + charts.
- Learn: quiz session in the terminal + summary.

## Brand commitments (must survive any redesign)
- The in-terminal experience is sacred: real terminal metaphor, per-char
  coloring, prompt strings, user-selectable terminal THEMES (dracula, nord,
  gruvbox, solarized, catppuccin, CRT green, paper, …) — the theme picker is
  functionality, not decoration; test/learn terminal surfaces obey the theme.
- Each visual world chooses a period-correct terminal/monospace face of its
  own (the earlier Google Sans Code restriction was lifted by the user).
- Keyboard-first interaction (enter/tab+enter/esc chords, 1-4 answers).
- Attribution footer: tldr-pages (CC BY 4.0), @withfig/autocomplete (ISC).
- All functionality stays exactly as-is; this is a visual-world replacement.

## Anti-references
- The current chrome reads as the generic AI dark-app look: near-black page,
  one green accent, rounded cards, uniform segment pills. The user explicitly
  wants out of this lane ("looks like a typical Claude created site").
- No hype copy; the register is plain, lowercase, tool-like.
