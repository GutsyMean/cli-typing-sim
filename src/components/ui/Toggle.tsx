/** A small annunciator lamp: dark lens off, warm lamp when latched on. */
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
      <span
        className={`text-[14px] ${
          checked ? 'text-legend' : 'text-legend-dim group-hover:text-legend'
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`lens flex h-5 w-10 items-center justify-center text-[9px] font-semibold tracking-[0.12em] uppercase ${
          checked ? 'lens-lit' : ''
        }`}
      >
        {checked ? 'on' : 'off'}
      </span>
    </button>
  )
}
