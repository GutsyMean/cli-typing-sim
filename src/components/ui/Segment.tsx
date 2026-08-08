import { SignChevron } from './signage'

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/**
 * A black destination rail: one choice per slot, and the followed
 * destination stays lit in signage yellow.
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
    <div className="board inline-flex flex-wrap">
      {options.map((opt, i) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.hint}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`px-3.5 py-1.5 text-[14px] font-bold ${
              i > 0 ? 'border-l border-white/25' : ''
            } ${active ? 'bg-sign text-signink' : 'text-white hover:bg-panel/15'}`}
          >
            {active && <SignChevron className="mr-1.5 inline size-3 align-[-1px]" />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
