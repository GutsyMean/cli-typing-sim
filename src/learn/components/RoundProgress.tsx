import type { MasteryLevel } from '../learnStore'

/** One LED segment strip per batch command, lit segment-by-segment as mastery grows. */
export function RoundProgress({
  batch,
  levels,
}: {
  batch: string[]
  levels: Record<string, MasteryLevel>
}) {
  if (batch.length === 0) return null
  return (
    <div className="flex items-center gap-1.5" title="round progress — each strip is a command, lit as you master it">
      {batch.map((key) => {
        const level = levels[key] ?? 0
        return (
          <span key={key} className="bevel-down flex h-2.5 w-8 gap-px overflow-hidden p-px">
            {[0, 1, 2].map((seg) => (
              <span
                key={seg}
                className={`h-full flex-1 transition-colors duration-300 ${
                  level > seg ? 'bg-[var(--w-teal-led)]' : 'bg-transparent'
                }`}
              />
            ))}
          </span>
        )
      })}
    </div>
  )
}
