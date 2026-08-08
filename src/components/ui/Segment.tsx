const groupColor: Record<string, string> = {
  mode: 'bg-key-red text-[#2a0507]',
  duration: 'bg-key-orange text-[#2b1203]',
  count: 'bg-key-orange text-[#2b1203]',
  learnScope: 'bg-key-orange text-[#2b1203]',
  caret: 'bg-key-white text-[#1c1c1a]',
  fontsize: 'bg-key-white text-[#1c1c1a]',
  behavior: 'bg-key-white text-[#1c1c1a]',
}

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** shown as a native tooltip on hover */
  hint?: string
}

/** A row of step keys; the armed one's LED lights and its cap comes up to full color. */
export function Segment<T extends string | number>({
  options,
  value,
  onChange,
  groupId = 'mode',
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  /** picks the key color quarter for this bank */
  groupId?: string
}) {
  const color = groupColor[groupId] ?? 'bg-key-white text-[#1c1c1a]'
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
            className={`step flex flex-col items-center gap-1 px-3.5 pt-1.5 pb-2 ${color} ${
              active ? '' : 'step-off'
            }`}
          >
            <span aria-hidden className={`sled ${active ? 'sled-lit' : ''}`} />
            <span className="text-[12px] leading-none font-bold tracking-wide uppercase">
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
