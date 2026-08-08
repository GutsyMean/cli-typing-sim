import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The terminal window: the one full-color object on the one-bit desktop.
 * Pinstriped title bar and ink chrome outside, the user's theme inside.
 */
export function TerminalFrame({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const themeId = useSettings((s) => s.theme)
  const crt = themeById(themeId).crt ?? false

  return (
    <div className="window">
      <div className="titlebar">
        <span className="closebox" aria-hidden />
        <span className="titlebar-chip">{title}</span>
      </div>
      <div className={`relative bg-term ${crt ? 'scanlines' : ''}`}>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
