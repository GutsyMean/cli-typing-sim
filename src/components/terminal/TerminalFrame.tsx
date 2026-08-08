import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The machine's display deck: silkscreen label strip over the themed
 * terminal glass. Interior obeys --t-* vars.
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
    <div className="deck p-2.5 sm:p-3">
      <div className="mb-2 flex items-center justify-between gap-3 px-1.5 select-none">
        <span className="silk text-[10px]">{title}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="silk text-[9px]">run</span>
          <span aria-hidden className="sled sled-lit" />
        </span>
      </div>
      <div
        className={`relative rounded-[4px] bg-term shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7),inset_0_3px_12px_rgba(0,0,0,0.55)] ${
          crt ? 'scanlines' : ''
        }`}
      >
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
