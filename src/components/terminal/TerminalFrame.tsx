import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'
import { SignArrow } from '../ui/signage'

/**
 * The gate: a yellow overhead band names the destination, and the themed
 * terminal is the jet bridge below it. Interior obeys --t-* vars.
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
    <div>
      <div className="sign-band sign-hung flex items-center justify-between gap-4 px-4 py-2.5 select-none">
        <span className="text-[15px] font-bold">{title}</span>
        <SignArrow className="size-5 shrink-0" />
      </div>
      <div
        className={`relative bg-term shadow-[0_10px_28px_-12px_rgba(23,24,28,0.55)] ${
          crt ? 'scanlines' : ''
        }`}
      >
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
