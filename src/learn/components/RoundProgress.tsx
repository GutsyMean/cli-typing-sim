import type { MasteryLevel } from '../learnStore'

/** One pip per batch command, filled by mastery level (3 segments). */
export function RoundProgress({
  batch,
  levels,
}: {
  batch: string[]
  levels: Record<string, MasteryLevel>
}) {
  if (batch.length === 0) return null
  return (
    <div className="flex items-center gap-1.5" title="round progress — each pip is a command, filled as you master it">
      {batch.map((key) => {
        const level = levels[key] ?? 0
        return (
          <span key={key} className="board pip-track flex h-2.5 w-8 gap-px overflow-hidden p-px shadow-none">
            {[0, 1, 2].map((seg) => (
              <span
                key={seg}
                className={`h-full flex-1 transition-colors duration-300 ${
                  level > seg ? 'bg-sign' : 'bg-transparent'
                }`}
              />
            ))}
          </span>
        )
      })}
    </div>
  )
}
