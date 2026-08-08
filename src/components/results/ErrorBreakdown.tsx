import type { TestMetrics } from '../../engine/metrics'
import { categoryLabel } from '../../data/commands'
import { fmtPercent } from '../../lib/format'

export function ErrorBreakdown({ metrics }: { metrics: TestMetrics }) {
  const { missedChars, categoryErrors } = metrics
  if (missedChars.length === 0 && categoryErrors.length === 0) return null

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {missedChars.length > 0 && (
        <div className="module p-4 pt-3">
          <h3 className="placard mb-3 px-4 text-[9px]">most missed keys</h3>
          <div className="flex flex-wrap gap-2">
            {missedChars.map((m) => (
              <span key={m.char} className="inline-flex items-center gap-1.5">
                <kbd
                  className="min-w-8 rounded-[3px] px-2 py-1 text-center font-mono text-base font-bold shadow-[0_0_14px_-3px_var(--w-stop)]"
                  style={{ background: 'var(--w-stop)', color: '#2b0a06' }}
                >
                  {m.char === ' ' ? '␣' : m.char}
                </kbd>
                <span className="text-xs text-legend-dim">×{m.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryErrors.length > 0 && (
        <div className="module p-4 pt-3">
          <h3 className="placard mb-3 px-4 text-[9px]">accuracy by category</h3>
          <div className="flex flex-col gap-2">
            {categoryErrors.slice(0, 5).map((c) => {
              const acc = c.total === 0 ? 100 : ((c.total - c.errors) / c.total) * 100
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs text-legend">
                    {categoryLabel(c.category)}
                  </span>
                  <span className="readout h-3 flex-1 overflow-hidden p-px shadow-none">
                    <span
                      className="block h-full bg-readout"
                      style={{ width: `${acc}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-xs text-legend-dim tabular-nums">
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
