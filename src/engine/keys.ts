export type KeyAction =
  | { kind: 'char'; char: string }
  | { kind: 'backspace' }
  | { kind: 'wordBackspace' }
  | { kind: 'enter' }
  | { kind: 'ignore'; swallow: boolean }

/**
 * Classify a keydown for the typing engine.
 * `swallow` on ignore means preventDefault should still be called
 * (dead keys, quick-find triggers) without touching engine state.
 */
export function classifyKey(e: KeyboardEvent): KeyAction {
  if (e.key === 'Backspace') {
    return e.ctrlKey || e.altKey || e.metaKey
      ? { kind: 'wordBackspace' }
      : { kind: 'backspace' }
  }
  if (e.key === 'Enter') {
    if (e.ctrlKey || e.altKey || e.metaKey) return { kind: 'ignore', swallow: false }
    return { kind: 'enter' }
  }
  // Dead keys on intl layouts: swallow silently, never count as an error.
  if (e.key === 'Dead') return { kind: 'ignore', swallow: true }

  if (e.key.length === 1) {
    // AltGr (reported as ctrl+alt on some browsers) produces legitimate
    // printable chars on AZERTY/QWERTZ — must be accepted.
    const altGraph = e.getModifierState('AltGraph')
    if ((e.ctrlKey || e.metaKey || e.altKey) && !altGraph) {
      return { kind: 'ignore', swallow: false }
    }
    return { kind: 'char', char: e.key }
  }

  return { kind: 'ignore', swallow: false }
}
