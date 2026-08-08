import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The main panel: black nylon with a stitched seam, the quoted label plate
 * on top, hazard stripe underneath. Interior obeys --t-* vars.
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
    <div>
      <div className="flex items-end justify-between px-0.5 pb-1.5 select-none">
        <span className="quoted text-[13px] text-nylon">{title}</span>
        <span className="font-mono text-[10px] text-nylon-soft uppercase">
          lot: {theme.label} · size: os
        </span>
      </div>
      <div className="nylon p-2">
        <div className={`relative bg-term ${crt ? 'scanlines' : ''}`}>
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
      <div aria-hidden className="hazard mt-1.5 h-2.5" />
    </div>
  )
}
