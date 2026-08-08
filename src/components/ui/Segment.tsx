export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/** A bank of annunciator buttons: the latched one glows lamp-amber. */
export function Segment<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  /** kept for call-site compatibility */
  groupId?: string
}) {
  return (
    <div className="inline-flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.hint}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`lens px-3.5 py-2 text-[12px] tracking-[0.08em] uppercase ${
              active ? 'lens-lit' : ''
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
