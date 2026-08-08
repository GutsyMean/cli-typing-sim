---
name: termtype
description: Airport-concourse wayfinding chrome around a sacred, user-themed terminal
colors:
  signage-yellow: "#ffd200"
  board-black: "#17181c"
  board-soft: "#4c4e56"
  hall-gray: "#e9e8e4"
  hall-line: "#c9c8c2"
  closed-red: "#cc3524"
  panel-white: "#ffffff"
  ink: "#17181c"
  sign-ink: "#17181a"
  board-lettering: "#f2f2ef"
typography:
  display:
    fontFamily: "B612 Mono, ui-monospace, monospace"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "PT Sans, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    letterSpacing: "-0.025em"
  title:
    fontFamily: "PT Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  body:
    fontFamily: "PT Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "PT Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.025em"
  terminal:
    fontFamily: "B612 Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.9
rounded:
  none: "0px"
spacing:
  band-x: "14px"
  band-y: "8px"
  panel: "16px"
  panel-lg: "20px"
  section-gap: "40px"
components:
  sign-band:
    backgroundColor: "{colors.signage-yellow}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  board:
    backgroundColor: "{colors.board-black}"
    textColor: "{colors.board-lettering}"
    rounded: "{rounded.none}"
  picto:
    backgroundColor: "{colors.board-black}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
  button-start:
    backgroundColor: "{colors.board-black}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  segment-slot:
    backgroundColor: "{colors.board-black}"
    textColor: "#ffffff"
    padding: "6px 14px"
  segment-slot-active:
    backgroundColor: "{colors.signage-yellow}"
    textColor: "{colors.sign-ink}"
    padding: "6px 14px"
  readout:
    backgroundColor: "{colors.board-black}"
    textColor: "{colors.signage-yellow}"
    padding: "6px 12px"
  kbd:
    backgroundColor: "{colors.board-black}"
    textColor: "#ffffff"
    typography: "{typography.terminal}"
    padding: "2px 6px"
---

# Design System: termtype

## Overview

**Creative North Star: "The Airport Concourse"**

termtype's chrome is an airport terminal building: a concourse-gray hall with
faint floor expansion joints, saturated signage-yellow bands hung from black
rails, and black departure boards with monumental figures. Every configuration
surface is a wayfinding decision point — one sign band per decision, a white
content panel beneath it, a drawn white pictogram on a black inset square
locked to the band's leading edge. The typing test itself is the gate: a
yellow overhead band names the destination, and the user-themed terminal is
the jet bridge below it. The world deliberately refuses the dark-app-with-
neon-accent default; the ground is light gray by day, and night is a lighting
change (hall lights off, signage stays backlit), not a different design.

Two token layers coexist and never mix. The `--w-*` concourse layer is fixed:
signage yellow, board black, hall gray. The `--t-*` terminal layer is
user-selectable (dracula, nord, gruvbox, CRT green, paper, …) and rules only
the terminal interior — the glass behind the gate sign. Themes never touch the
chrome; the chrome never leaks into the terminal.

**Key Characteristics:**
- Signage yellow (#ffd200) reserved exclusively for wayfinding
- Square corners everywhere; signs, boards, and panels are flat cut sheets
- Drawn SVG pictograms and arrows, never font glyphs or icon libraries
- Sentence case on sign bands, uppercase micro-labels per departures-board convention, lowercase tool-like copy
- Day/night as hall lighting (`data-night` on `<html>`), not as re-theming
- One authored ornamental motion: the split-flap

## Colors

A civic wayfinding palette — one saturated signal color on black and gray
infrastructure — with a second, user-owned palette confined behind the
terminal glass.

### Primary
- **Signage Yellow** (`--w-sign`, #ffd200): the lit sign material. Used for hanging sign bands, the followed/selected state of every control (segment slots, category tiles, theme cards), gate-numeral figures on black boards, mastery pip fills, and text selection. It marks "the route you are on," never data.

### Secondary
- **Closed-Route Red** (`--w-closed`, #cc3524): the only other signal. Error dots on the WPM chart, "needs work" counts, the armed destructive reset. Sparse by design — a closed gate, not an accent.

### Neutral
- **Board Black** (`--w-board`, #17181c): sign boards, rails, pictogram squares, primary buttons, the focus outline, hanger stems. Deepens to #0d0e11 at night.
- **Board Soft** (`--w-board-soft`, #4c4e56): secondary text on the light ground (hints, dim labels, scrollbar). Inverts to a light gray #a3a6b0 at night.
- **Hall Gray** (`--w-hall`, #e9e8e4): the concourse floor/wall — the page ground, overlaid with 1px floor joints every 120px. Night: #131418.
- **Hall Line** (`--w-hall-line`, #c9c8c2): expansion joints, hairline borders on idle tiles, dashed empty-state frames. Night: #26282e.
- **Panel White** (`--w-panel`, #ffffff): the white content panel under each sign band. Night: #1c1e24.
- **Ink** (`--w-ink`, #17181c): text on hall and panels. Night: #eceef2.
- **Sign Ink** (`--color-signink`, #17181a): text sitting on lit yellow. Fixed — never swapped by night mode.
- **Board Lettering** (#f2f2ef): text and data lines on black boards. Fixed literal, not a variable — board lettering stays lit when the hall goes dark.

### The Terminal Layer
The `--t-*` variables (bg, chrome, surface, fg, dim, err, accent, prompt
colors, edge) are written by `applyTheme.ts` from the user's theme choice and
govern everything inside the terminal frame: per-character coloring, prompts,
carets, the CRT scanline overlay. They are functionality, not decoration, and
are out of scope for this document's palette rules.

### Named Rules
**The Wayfinding-Only Yellow Rule.** Signage yellow appears only where a sign
would: bands, selected routes, gate numerals, pip fills. It is never a data
mark — chart lines and bars on black boards are white and white-alpha
(#f2f2ef, rgba(255,255,255,.45)); errors are closed-route red.

**The Two-Layer Rule.** `--w-*` is the fixed concourse; `--t-*` is the themed
terminal interior. No component reads across the boundary. A new chrome
surface uses `--w-*` tokens only; anything behind the terminal glass uses
`--t-*` only.

**The Lit-Sign Rule.** Text on yellow is always Sign Ink (#17181a) and text on
board black is always Board Lettering (#f2f2ef), day or night. Signs are
backlit; the hall lighting never changes what is printed on them.

## Typography

**Display Font:** B612 Mono (self-hosted woff2, 400/700) — the aviation
instrument face, used for all monospace: terminal text, commands, figures.
**Body Font:** PT Sans (self-hosted woff2, 400/700, with system-ui fallback)
— the black humanist sans of the signage.

**Character:** Transit signage meets cockpit instrumentation. PT Sans carries
every sign and label in bold, matter-of-fact sentence case; B612 Mono renders
anything the machine says — commands, WPM figures, category names — with
`tabular-nums` on all numeric readouts and ligatures disabled in the terminal.

### Hierarchy
- **Display** (700, 6rem `text-8xl`, line-height 1, B612 Mono): the monumental gate numeral — the results WPM figure in signage yellow on board black. One per screen at most.
- **Headline** (700, 2.25rem → 3rem at `sm:`, tracking-tight): the "termtype" masthead wordmark only.
- **Title** (700, 15–16px): sign-band titles ("Test", "Command sets", "Display") in sentence case; the gate band over the terminal.
- **Body** (400, 13–15px): panel content, hints, footer copy — lowercase, tool-like register.
- **Label** (700, 11–13px, uppercase, tracking-wide): departures-board micro-labels — group headers ("MODE"), readout units ("WPM"), panel section headings.
- **Terminal** (400, `--terminal-font-size` 1rem–1.5rem user-set, default 1.125rem, line-height 1.9, B612 Mono, no ligatures): everything typed and prompted inside the glass.

### Named Rules
**The Departures-Board Case Rule.** Uppercase exists only at micro-label size
(≤13px, bold, tracking-wide). Sign bands use sentence case; running copy is
lowercase. No uppercase headlines, ever.

**The Drawn-Mark Rule.** Every glyph in the chrome is a drawn SVG stroke —
the arrow, check, cross, chevron, and pictograms — in the world's 2.2-stroke
grammar (small sub-16px marks thicken to 2.6 for legibility), white on black
inset squares or `currentColor` inline. Font characters, emoji, and icon
libraries never appear in the chrome.

## Layout

A single centered column, `max-width: 56rem` (max-w-4xl), on the hall ground
with page padding `px-4 py-8` (sm: `px-8 py-12`). The home screen is a chain
of decision points stacked with a 40px gap (`gap-10`): each is a hung sign
band (14px hanger stems at 12% from each edge, 4px wide, board black)
directly above its white content panel (16–20px internal padding). The
masthead band leads with the largest pictogram square, the wordmark, and the
black departure (start) block; a stats subrow sits under a 2px board-black
rule. The footer closes the page with a 4px board-black rule.

The hall itself carries texture: a repeating 1px vertical joint line
(rgba(23,24,28,.05)) every 120px over `--w-hall`. Grids inside panels use
Tailwind's default spacing scale — category tiles at 2/3/5 columns
(base/sm/lg), theme cards at 2/4, options at 1/2. Density is compact and
desktop-first; the experience is keyboard-first and every primary action has
a visible key hint (Kbd chips).

## Elevation & Depth

Flat materials with hanging depth. Signs and boards cast one soft downward
shadow to read as physically hung sheets: `0 6px 16px -8px rgba(23,24,28,.4)`
(sign bands), `.5` alpha (boards), `0 8px 20px -12px rgba(23,24,28,.35)`
(panels), `0 10px 28px -12px rgba(23,24,28,.55)` (the terminal). No inner
shadows, no layered elevation scale — everything hangs at the same height.

At night the model inverts from shadow to light: sign bands gain a yellow
backlight glow (`0 0 34px -6px rgba(255,210,0,.28)`), and black boards and
pip tracks gain 1px white edge rings (rgba(255,255,255,.14)/.4) so black-on-
black stays legible.

### Named Rules
**The Hung-Not-Raised Rule.** Shadows exist only to say "this sheet hangs in
the hall." They never respond to hover or state, and nothing floats above
anything else.

## Shapes

Square, always. There is no border radius anywhere in the chrome — sign
bands, boards, buttons, tiles, inputs, kbd chips, and pips are all hard-cut
rectangles (0px). Form language comes from borders instead: 1px `hall-line`
hairlines on idle tiles, `border-l` white/25 dividers between slots on a
black rail, 2px ink borders on form controls (the prompt `<select>`), 2px
dashed `hall-line` frames for empty states, and heavy 2–4px board-black rules
as structural dividers. The recurring silhouette is the hung sign: a wide
shallow band with two short stems above it.

## Components

### Sign Band (`.sign-band` / `.sign-hung`)
The world's signature container: signage yellow, board-black text, soft drop
shadow, optionally hung from two 4x14px black stems (12% inset from each
end). Home decision sections, the terminal's gate band, the results
"Arrivals" strip, and the chart hover tooltip are all sign bands. Leading
pictogram square, sentence-case bold title, trailing drawn arrow.

### Board (`.board`)
Black panel with fixed light lettering (#f2f2ef): the departures board. Used
for segment rails, the start button, readouts, kbd chips, the WPM chart
surface, and progress-bar tracks. At night it keeps its lettering and gains a
white edge ring.

### Pictogram Square (`.picto`)
White drawn glyph on a black inset square, `flex-shrink: 0`, locked to panel
or band edges. Glyphs use the 2.2-stroke grammar (stopwatch, crates, route,
monitor, sliders, rising line, keyboard).

### Segment (destination rail)
- **Shape:** square black rail (`.board`), slots divided by 1px white/25 borders.
- **Slot:** 14px bold, `px-3.5 py-1.5`, white text; hover `bg-panel/15`.
- **Active:** signage yellow with Sign Ink text and a leading drawn chevron (checks for multi-select difficulty). The followed destination stays lit.

### Toggle (route switch)
A 24px square that is either an empty box (2px board-soft border on panel) or
a filled `.picto` with a 2.2-stroke white check. Label turns bold ink when
open, board-soft otherwise. No pill, no sliding thumb.

### Category / Theme Tiles
Idle: panel background, 1px hall-line border, mono 13px bold name plus 11px
blurb. Selected: whole tile goes signage yellow, Sign Ink text, leading drawn
arrow. Theme cards preview the actual `--t-*` colors in a mini prompt and
carry a yellow caption band when boarding.

### Readout / Kbd
Live stats are gate-number boards: black, monospace 2xl yellow figure
(`tabular-nums`), 11px uppercase white unit. Kbd chips are miniature boards:
mono 11px white on black.

### Buttons
Primary actions ("Start typing") are board-black blocks, white 16px bold
text, `px-6 py-3.5`, trailing drawn arrow that translates 4px right on hover;
hover deepens to pure black. Destructive confirmation (reset progress) arms
into closed-red with white text on first click.

### Terminal Frame (the gate)
A yellow gate band (title + arrow) hung above the themed glass: `bg-term`
(`--t-bg`), the deepest shadow in the system, optional `.scanlines` CRT
overlay for CRT themes. Everything inside obeys `--t-*` and
`.terminal-text` (B612 Mono, user font size, line-height 1.9).

### Charts (results / history)
Drawn inline SVG on the board: smoothed WPM line in board lettering white
(2.5px), raw ghost line in white/45, error dots in closed red, 10px white/75
axis text, white/18 gridlines. Progress bars are board tracks with white
(mastered) and white/40 (learning) fills; round pips are 3-segment tracks
filled in signage yellow.

## Motion

One authored ornamental motion: **the split-flap** (`.flap`, rotateX 90° → 0
with a −14° overshoot, 0.28s ease-out, top-center origin) — used on the big
results figure, as a departures board flips its plate. Everything else is
functional: screen and section entrances are quiet springs (bounce 0,
visualDuration 0.3–0.35, y 10–14px), config sub-panels crossfade in 0.12s,
results figures count up over 0.9s (`[0.22, 1, 0.36, 1]`), chart paths draw
over 0.9s, the caret blinks on a 1.1s stepped cycle. `prefers-reduced-motion`
zeroes all animation and transitions globally.

**The One-Flap Rule.** New surfaces may enter with the quiet spring; only a
departures-board figure may flap. No other ornamental motion enters the
world.

## Do's and Don'ts

### Do:
- **Do** build every new chrome surface from the signage vocabulary: `.sign-band`, `.board`, `.picto`, panel-under-sign — one decision per sign.
- **Do** reserve #ffd200 for wayfinding states (bands, selected routes, gate numerals, pip fills) and use white/white-alpha for data marks on boards.
- **Do** use Sign Ink (#17181a) on yellow and #f2f2ef on board black, in both day and night.
- **Do** draw new marks as SVG strokes in the 2.2 grammar (2.6 below 16px) — extend `signage.tsx` or the home-screen pictogram set.
- **Do** keep numerals in B612 Mono with `tabular-nums`, and keep the register lowercase and plain.
- **Do** give every primary action a visible Kbd hint; the product is keyboard-first.
- **Do** style night via `html[data-night]` overrides of `--w-*` plus the glow shadows — never per-component dark variants.

### Don't:
- **Don't** round a corner. The chrome is 0px radius throughout.
- **Don't** let `--t-*` theme variables color anything outside the terminal glass, or `--w-*` anything inside it.
- **Don't** use font glyphs, emoji, or icon libraries for chrome marks; the arrow is a drawn path, never "→".
- **Don't** use uppercase above micro-label size, or hype copy in any register.
- **Don't** add hover elevation, glows (outside the night lighting model), gradients on materials, or a second ornamental animation.
- **Don't** reintroduce the anti-reference: near-black page + single neon accent + rounded cards is the lane this world exists to refuse.
