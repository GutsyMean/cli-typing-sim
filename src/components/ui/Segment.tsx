import { motion } from 'motion/react'

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
}

export function Segment<T extends string | number>({
  options,
  value,
  onChange,
  groupId,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  /** unique per group — scopes the sliding highlight */
  groupId: string
}) {
  return (
    <div className="inline-flex rounded-lg border border-edge bg-surface p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative rounded-md px-3 py-1.5 font-sans text-[13px] font-medium transition-colors duration-150 ${
              active ? 'text-typed' : 'text-dim hover:text-fg'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`segment-${groupId}`}
                transition={{ type: 'spring', stiffness: 600, damping: 45 }}
                className="absolute inset-0 rounded-md bg-raised"
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
