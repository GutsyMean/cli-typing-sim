import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The CRT window: a molded faceplate with an engraved title plate, power LED,
 * and the themed terminal screen set deep behind a machined bezel. Everything
 * inside the glass stays on --t-* theme vars.
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
    <div className="bevel-up p-2 sm:p-3">
      <div className="mb-2 flex items-center justify-between gap-3 px-1 select-none">
        <span className="engraved text-[10px]">{title}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="font-display text-[8px] tracking-[0.1em] text-ink-faint">
            PWR
          </span>
          <span aria-hidden className="led led-on" />
        </span>
      </div>
      <div className="bevel-down p-1.5">
        <div
          className={`relative bg-term shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5),inset_0_4px_14px_rgba(0,0,0,0.45)] ${
            crt ? 'scanlines' : ''
          }`}
        >
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
