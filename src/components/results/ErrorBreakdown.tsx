import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div className="bg-panel p-4 shadow-[0_8px_20px_-12px_rgba(23,24,28,0.35)]">
          <h3 className="mb-3 text-[13px] font-bold text-ink uppercase tracking-wide">
            Most missed keys
          </h3>
          <div className="flex flex-wrap gap-2">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-1.5">
                <kbd className="picto min-w-8 px-2 py-1 text-center font-mono text-base font-bold">
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="text-xs text-board-soft">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div className="bg-panel p-4 shadow-[0_8px_20px_-12px_rgba(23,24,28,0.35)]">
          <h3 className="mb-3 text-[13px] font-bold text-ink uppercase tracking-wide">
            Accuracy by category
          </h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs font-bold text-ink">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="board h-3 flex-1 overflow-hidden shadow-none">
                    <span
                      className="block h-full bg-sign"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-xs text-board-soft tabular-nums">
                    {fmtPercent(acc)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
