/** Classic checkbox row: 2px square box, X mark when checked. */
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
      className="group flex w-full items-center gap-2.5 px-1 py-1.5 text-left"
    >
      <span
        aria-hidden
        className="flex size-[15px] shrink-0 items-center justify-center border-2 border-ink bg-paper"
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="size-[9px]">
            <path
              d="M1.5 1.5l7 7M8.5 1.5l-7 7"
              stroke="var(--w-ink)"
              strokeWidth="2"
            />
          </svg>
        )}
      </span>
      <span className={`text-[13px] text-ink ${checked ? 'font-bold' : 'group-hover:underline'}`}>
        {label}
      </span>
    </button>
  )
}
