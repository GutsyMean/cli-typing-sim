export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/**
 * Order-form single-choice row: square tick boxes in a ruled strip,
 * "mark one" print convention.
 */
export function Segment<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  groupId?: string
}) {
  return (
    <div className="inline-flex flex-wrap items-stretch border border-ink bg-paper-hi">
      {options.map((opt, i) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.hint}
            onClick={() => onChange(opt.value)}
            className={`group flex items-center gap-2 px-3 py-1.5 font-sans text-[13px] font-semibold tracking-wide uppercase transition-colors duration-100 ${
              i > 0 ? 'border-l border-ink/40' : ''
            } ${active ? 'bg-ink text-paper-hi' : 'text-ink-soft hover:bg-ink/10 hover:text-ink'}`}
          >
            <span
              aria-hidden
              className={`inline-block size-3 border ${
                active ? 'border-paper-hi bg-safety' : 'border-ink-soft bg-transparent group-hover:border-ink'
              }`}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
