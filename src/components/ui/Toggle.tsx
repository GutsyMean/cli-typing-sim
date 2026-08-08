/** A signage switch: black pictogram square, white check when the route is open. */
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
      className="group flex w-full items-center gap-3 px-1 py-1.5 text-left"
    >
      <span
        aria-hidden
        className={`flex size-6 shrink-0 items-center justify-center ${
          checked ? 'picto' : 'border-2 border-board-soft bg-panel'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="size-3.5">
            <path
              d="M2 6.5l2.8 2.8L10 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            />
          </svg>
        )}
      </span>
      <span
        className={`text-[14px] ${
          checked ? 'font-bold text-ink' : 'text-board-soft group-hover:text-ink'
        }`}
      >
        {label}
      </span>
    </button>
  )
}
