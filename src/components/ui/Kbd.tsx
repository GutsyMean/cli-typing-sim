import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-[4px] border border-deck-edge bg-deck px-1.5 py-0.5 font-mono text-[11px] text-silk shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      {children}
    </kbd>
  )
}

export function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-silk-dim">
      {keys.map((k, i) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          {i > 0 && <span>+</span>}
          <Kbd>{k}</Kbd>
        </span>
      ))}
      <span className="ml-0.5 text-silk">{label}</span>
    </span>
  )
}
