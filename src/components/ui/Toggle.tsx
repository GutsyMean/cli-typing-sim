/** A small white step key with its LED: armed = lit. */
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
          checked ? 'text-silk' : 'text-silk-dim group-hover:text-silk'
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`step flex h-6 w-11 items-center justify-center gap-1.5 bg-key-white text-[#1c1c1a] ${
          checked ? '' : 'step-off'
        }`}
      >
        <span className={`sled ${checked ? 'sled-lit' : ''}`} />
        <span className="text-[9px] leading-none font-bold uppercase">
          {checked ? 'on' : 'off'}
        </span>
      </span>
    </button>
  )
}
