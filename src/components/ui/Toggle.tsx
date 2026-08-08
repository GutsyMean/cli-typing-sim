/** Order-form checkbox row: square box, ink tick, ruled underline. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 border-b border-ink/25 px-1 py-2 text-left"
    >
      <span
        className={`font-sans text-[13px] transition-colors ${
          checked ? 'font-semibold text-ink' : 'text-ink-soft group-hover:text-ink'
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`flex size-4.5 shrink-0 items-center justify-center border-2 transition-colors ${
          checked ? 'border-ink bg-ink' : 'border-ink-soft bg-paper-hi group-hover:border-ink'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="size-3" aria-hidden>
            <path d="M1.5 5.5l2.2 2.3L8.5 2" fill="none" stroke="var(--w-safety)" strokeWidth="2" />
          </svg>
        )}
      </span>
    </button>
  )
}
