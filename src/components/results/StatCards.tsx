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

/** The Get Info window: big bitmap numerals over a ruled spec table. */
export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="window">
      <div className="titlebar">
        <span className="closebox" aria-hidden />
        <span className="titlebar-chip">test info</span>
      </div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 p-5">
        <div>
          <div className="font-display text-6xl leading-none text-ink tabular-nums">
            <CountUp value={metrics.wpm} format={fmtInt} />
          </div>
          <div className="mt-1 text-[12px] text-ink">words per minute</div>
        </div>
        <div>
          <div className="font-display text-6xl leading-none text-ink tabular-nums">
            <CountUp value={metrics.accuracy} format={fmtPercent} delay={0.1} />
          </div>
          <div className="mt-1 text-[12px] text-ink">accuracy</div>
        </div>
        <table className="text-[13px] text-ink">
          <tbody>
            {(
              [
                ['raw', <CountUp key="r" value={metrics.raw} format={fmtInt} delay={0.2} />],
                [
                  'consistency',
                  <CountUp key="c" value={metrics.consistency} format={fmtPercent} delay={0.25} />,
                ],
                ['time', fmtClock(metrics.seconds)],
                ['chars', `${metrics.correctChars}/${metrics.totalChars}`],
              ] as const
            ).map(([label, v]) => (
              <tr key={label} className="border-b border-ink/25 last:border-0">
                <td className="pr-6 py-0.5">{label}</td>
                <td className="py-0.5 text-right font-bold tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
