export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/** Classic radio-button row: one filled dot per group, labels in data text. */
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
    <div className="inline-flex flex-wrap gap-x-4 gap-y-1.5">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.hint}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className="group inline-flex items-center gap-1.5 py-0.5 text-[16px] text-ink"
          >
            <span
              aria-hidden
              className="flex size-[15px] items-center justify-center rounded-full border-2 border-ink bg-paper"
            >
              {active && <span className="size-[7px] rounded-full bg-ink" />}
            </span>
            <span className={active ? 'font-bold' : 'group-hover:underline'}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
