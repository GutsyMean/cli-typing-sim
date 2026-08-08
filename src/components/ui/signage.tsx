/**
 * Drawn signage marks in the concourse's one 2.2-stroke pictogram grammar —
 * the arrow is the world's signature glyph and is never a font character.
 */
export function SignArrow({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3.5 12h16M13.5 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </svg>
  )
}

export function SignCheck({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M4.5 13l5 5L19.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      />
    </svg>
  )
}

export function SignCross({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      />
    </svg>
  )
}

export function SignChevron({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M9 5.5l6.5 6.5L9 18.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      />
    </svg>
  )
}
