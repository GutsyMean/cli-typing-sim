import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div>
          <h3 className="quoted mb-3 text-[13px] text-nylon">missed keys</h3>
          <div className="flex flex-wrap gap-2.5">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-1.5">
                <kbd className="ziptag min-w-8 px-2 py-1 text-center font-mono text-base">
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="text-xs font-semibold text-nylon-soft">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div>
          <h3 className="quoted mb-3 text-[13px] text-nylon">accuracy</h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs font-bold text-nylon">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="h-3 flex-1 overflow-hidden border-2 border-nylon bg-white">
                    <span
                      className="block h-full bg-nylon"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-xs font-semibold text-nylon-soft tabular-nums">
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
