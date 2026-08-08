export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/**
 * A bank of latching hardware keys set into a recessed track — the active
 * key sits visibly depressed with its LED lit.
 */
export function Segment<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  /** kept for call-site compatibility; keys latch mechanically, no shared highlight */
  groupId?: string
}) {
  return (
    <div className="bevel-down inline-flex gap-1 p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.hint}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-sans text-[13px] font-medium ${
              active ? 'key-down text-teal-deep' : 'key-up text-ink-soft'
            }`}
          >
            <span aria-hidden className={`led ${active ? 'led-on' : ''}`} />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
