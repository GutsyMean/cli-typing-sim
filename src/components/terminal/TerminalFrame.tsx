import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The terminal as the catalog's product photo: heavy ink frame, the user's
 * own theme inside, and a figure caption beneath. Interior obeys --t-* vars.
 */
export function TerminalFrame({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const themeId = useSettings((s) => s.theme)
  const theme = themeById(themeId)
  const crt = theme.crt ?? false

  return (
    <figure className="m-0">
      <div
        className={`relative border-2 border-ink bg-term shadow-[6px_6px_0_rgba(25,23,19,0.18)] ${
          crt ? 'scanlines' : ''
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-paper-hi px-3 py-1.5 select-none">
          <span className="font-sans text-[11px] font-bold tracking-[0.14em] text-ink uppercase">
            {title}
          </span>
          <span className="font-mono text-[10px] text-ink-soft uppercase">
            display: {theme.label}
          </span>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
      <figcaption className="mt-1.5 flex items-baseline justify-between font-mono text-[11px] text-ink-soft">
        <span>FIG. 1 — LIVE TERMINAL, ACTUAL SIZE</span>
        <span>PHOSPHOR AND CARET AS FITTED</span>
      </figcaption>
    </figure>
  )
}
