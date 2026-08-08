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

/** Giant quoted figures over a care-label table. */
export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
      <div>
        <div className="text-8xl leading-none font-extrabold tracking-tight text-nylon tabular-nums">
          <CountUp value={metrics.wpm} format={fmtInt} />
        </div>
        <div className="quoted mt-1.5 inline-block bg-nylon px-2 py-0.5 text-[11px] text-cotton">
          wpm
        </div>
      </div>
      <div>
        <div className="text-8xl leading-none font-extrabold tracking-tight text-nylon tabular-nums">
          <CountUp value={metrics.accuracy} format={fmtPercent} delay={0.1} />
        </div>
        <div className="quoted mt-1.5 inline-block bg-nylon px-2 py-0.5 text-[11px] text-cotton">
          accuracy
        </div>
      </div>
      {/* the care label */}
      <div className="plate min-w-52 px-4 py-3">
        <div className="mb-1.5 font-mono text-[9px] text-nylon-soft uppercase">
          care label — machine washable
        </div>
        <table className="w-full font-mono text-[12px] text-nylon">
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
              <tr key={label} className="border-b border-seam last:border-0">
                <td className="py-0.5 pr-6 uppercase">{label}</td>
                <td className="py-0.5 text-right font-bold tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
