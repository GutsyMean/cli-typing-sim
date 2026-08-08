export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/**
 * A row of stenciled crate plates; the chosen one goes black nylon and
 * keeps its orange zip tie on.
 */
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
            className={`relative px-3 py-1.5 text-[12px] font-extrabold tracking-wide uppercase ${
              active
                ? 'bg-nylon text-cotton'
                : 'border-2 border-nylon bg-white text-nylon hover:bg-cotton'
            }`}
          >
            &ldquo;{opt.label}&rdquo;
            {active && (
              <span
                aria-hidden
                key={String(opt.value)}
                className="ziptag absolute -top-2 -right-2 text-[8px]"
              >
                on
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
