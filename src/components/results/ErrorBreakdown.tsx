import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div className="window p-4">
          <h3 className="mb-3 font-display text-[10px] text-ink">most missed keys</h3>
          <div className="flex flex-wrap gap-2.5">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-1.5">
                <kbd className="inline-block min-w-8 border-2 border-ink bg-paper px-2 py-1 text-center font-mono text-base font-bold text-ink shadow-[2px_2px_0_var(--w-ink)]">
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="text-[14px] text-ink">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div className="window p-4">
          <h3 className="mb-3 font-display text-[10px] text-ink">accuracy by category</h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-[14px] text-ink">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="dither-25 h-3 flex-1 overflow-hidden border border-ink">
                    <span
                      className="block h-full bg-ink"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-[14px] text-ink tabular-nums">
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
