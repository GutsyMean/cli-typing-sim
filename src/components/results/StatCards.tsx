import { animate } from 'motion/react'
import { useEffect, useState } from 'react'
import type { TestMetrics } from '../../engine/metrics'
import { fmtClock, fmtInt, fmtPercent } from '../../lib/format'

function CountUp({
  value,
  format,
  delay = 0,
}: {
  value: number
  format: (n: number) => string
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDisplay,
    })
    return () => controls.stop()
  }, [value, delay])
  return <>{format(display)}</>
}

/** Results printed as the catalog's specification table. */
export function StatCards({ metrics }: { metrics: TestMetrics }) {
  const rows: [string, React.ReactNode][] = [
    ['words per minute', <CountUp key="w" value={metrics.wpm} format={fmtInt} />],
    ['accuracy', <CountUp key="a" value={metrics.accuracy} format={fmtPercent} delay={0.08} />],
    ['raw rate', <CountUp key="r" value={metrics.raw} format={fmtInt} delay={0.16} />],
    ['consistency', <CountUp key="c" value={metrics.consistency} format={fmtPercent} delay={0.24} />],
    ['duration', fmtClock(metrics.seconds)],
    ['characters', `${metrics.correctChars}/${metrics.totalChars}`],
  ]

  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
      <div>
        <div className="font-sans text-[11px] font-bold tracking-[0.16em] text-ink-soft uppercase">
          words per minute
        </div>
        <div className="headline text-[clamp(4rem,10vw,6rem)] text-safety">
          <CountUp value={metrics.wpm} format={fmtInt} />
        </div>
      </div>
      <table className="border-2 border-ink">
        <tbody>
          {rows.slice(1).map(([label, value], i) => (
            <tr key={label} className={i > 0 ? 'border-t border-ink/40' : ''}>
              <td className="border-r border-ink/40 bg-paper-hi px-3 py-1 font-sans text-[11px] font-bold tracking-wide text-ink-soft uppercase">
                {label}
              </td>
              <td className="px-3 py-1 text-right font-mono text-lg font-semibold text-ink tabular-nums">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
