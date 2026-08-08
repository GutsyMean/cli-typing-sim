import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div className="deck p-4">
          <h3 className="silk mb-3 text-[9px]">most missed keys</h3>
          <div className="flex flex-wrap gap-2">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-1.5">
                <kbd
                  className="step min-w-8 bg-key-yellow px-2 py-1 text-center font-mono text-base font-bold text-[#241b02]"
                >
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="text-xs text-silk-dim">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div className="deck p-4">
          <h3 className="silk mb-3 text-[9px]">accuracy by category</h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs text-silk">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="tempo h-3 flex-1 overflow-hidden p-px shadow-none">
                    <span
                      className="block h-full bg-tempo"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-xs text-silk-dim tabular-nums">
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
