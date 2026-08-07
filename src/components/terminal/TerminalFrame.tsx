import type { ReactNode } from 'react'
import { useSettings } from '../../settings/settingsStore'
import { themeById } from '../../settings/themes'

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
    <div
      className={`relative rounded-xl border border-edge bg-term shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] ${
        crt ? 'scanlines' : ''
      }`}
    >
      <div className="flex items-center gap-2 rounded-t-xl border-b border-edge bg-surface px-4 py-2.5 select-none">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center font-sans text-[13px] font-medium text-dim">
          {title}
        </span>
        <span className="w-[52px]" />
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}
