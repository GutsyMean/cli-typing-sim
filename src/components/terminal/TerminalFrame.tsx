import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

/**
 * The operator's CRT: a bezel module on the console with an engraved
 * placard and a power lamp; the brightest thing in the room. Interior
 * obeys --t-* vars.
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
    <div className="module p-2.5 sm:p-3">
      <div className="mb-2.5 flex items-center justify-between gap-3 px-5 select-none">
        <span className="placard text-[10px]">{title}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="placard text-[9px]">pwr</span>
          <span
            aria-hidden
            className="size-2 rounded-full bg-run shadow-[0_0_8px_var(--w-run)]"
          />
        </span>
      </div>
      <div
        className={`relative rounded-sm bg-term shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7),inset_0_3px_14px_rgba(0,0,0,0.6),0_0_44px_-10px_rgba(255,255,255,0.09)] ${
          crt ? 'scanlines' : ''
        }`}
      >
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
