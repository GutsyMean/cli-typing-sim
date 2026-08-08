/** A garment toggle: reads "ON" or "OFF" in quotes; on keeps the zip tie. */
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
        className={`text-[13px] font-semibold ${
          checked ? 'text-nylon' : 'text-nylon-soft group-hover:text-nylon'
        }`}
      >
        {label}
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <span
          className={`px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
            checked
              ? 'bg-nylon text-cotton'
              : 'hazard-off border border-nylon-soft bg-white text-nylon-soft'
          }`}
        >
          &ldquo;{checked ? 'on' : 'off'}&rdquo;
        </span>
        {checked && (
          <span aria-hidden className="ziptag absolute -top-2 -right-2 text-[7px]">
            &nbsp;
          </span>
        )}
      </span>
    </button>
  )
}
