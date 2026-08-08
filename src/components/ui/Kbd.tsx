import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border-2 border-nylon bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-nylon">
      {children}
    </kbd>
  )
}

export function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-nylon-soft">
      {keys.map((k, i) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          {i > 0 && <span>+</span>}
          <Kbd>{k}</Kbd>
        </span>
      ))}
      <span className="ml-0.5 font-semibold text-nylon">{label}</span>
    </span>
  )
}
