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

/** The departures board: monumental gate-number WPM, split-flap rows below. */
export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="board flex flex-wrap items-stretch gap-x-10 gap-y-4 px-6 py-5">
      <div className="flap">
        <div className="font-mono text-8xl leading-none font-bold text-sign tabular-nums">
          <CountUp value={metrics.wpm} format={fmtInt} />
        </div>
        <div className="mt-1 text-[13px] font-bold text-white uppercase">
          wpm — your gate
        </div>
      </div>
      <div className="grid flex-1 content-center gap-y-1 text-[15px]">
        {(
          [
            ['accuracy', <CountUp key="a" value={metrics.accuracy} format={fmtPercent} delay={0.1} />],
            ['raw wpm', <CountUp key="r" value={metrics.raw} format={fmtInt} delay={0.2} />],
            ['consistency', <CountUp key="c" value={metrics.consistency} format={fmtPercent} delay={0.25} />],
            ['time', fmtClock(metrics.seconds)],
            ['characters', `${metrics.correctChars}/${metrics.totalChars}`],
          ] as const
        ).map(([label, v]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-6 border-b border-white/20 pb-1 last:border-0"
          >
            <span className="text-white">{label}</span>
            <span className="font-mono font-bold text-sign tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
