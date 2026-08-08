import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div>
          <h3 className="engraved mb-3 text-[9px]">most missed keys</h3>
          <div className="flex flex-wrap gap-2">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-2">
                <kbd className="key-up inline-block min-w-8 px-2 py-1 text-center font-mono text-base font-semibold text-[#b8402c]">
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="font-sans text-xs text-ink-faint">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div>
          <h3 className="engraved mb-3 text-[9px]">accuracy by category</h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs text-ink">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="bevel-down h-2.5 flex-1 overflow-hidden">
                    <span
                      className="block h-full bg-teal"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right font-sans text-xs text-ink-soft tabular-nums">
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
