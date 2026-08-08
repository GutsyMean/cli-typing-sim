import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border border-ink/60 bg-paper-hi px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink">
      {children}
    </kbd>
  )
}

export function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-sans text-[12px] text-ink-soft">
      {keys.map((k, i) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          {i > 0 && <span>+</span>}
          <Kbd>{k}</Kbd>
        </span>
      ))}
      <span className="ml-0.5 uppercase tracking-wide">{label}</span>
    </span>
  )
}
