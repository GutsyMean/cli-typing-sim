import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[14px] text-ink shadow-[1px_1px_0_var(--w-ink)]">
      {children}
    </kbd>
  )
}

export function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[15px] text-ink">
      {keys.map((k, i) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          {i > 0 && <span>+</span>}
          <Kbd>{k}</Kbd>
        </span>
      ))}
      <span className="ml-0.5">{label}</span>
    </span>
  )
}
