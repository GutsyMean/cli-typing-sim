/** A latching push-switch with a status LED — down + lit means on. */
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
      className="group flex w-full items-center justify-between gap-3 px-1 py-1.5 text-left"
    >
      <span className="font-sans text-[13px] text-ink-soft transition-colors group-hover:text-ink">
        {label}
      </span>
      <span
        className={`flex h-6 w-11 shrink-0 items-center justify-center gap-1.5 ${
          checked ? 'key-down' : 'key-up'
        }`}
      >
        <span aria-hidden className={`led ${checked ? 'led-on' : ''}`} />
        <span
          className={`font-display text-[8px] tracking-[0.1em] ${
            checked ? 'text-teal-deep' : 'text-ink-faint'
          }`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      </span>
    </button>
  )
}
