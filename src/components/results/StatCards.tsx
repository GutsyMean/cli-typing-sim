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

function BigReadout({
  label,
  value,
  format,
  delay,
}: {
  label: string
  value: number
  format: (n: number) => string
  delay?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="readout px-5 py-2 font-mono text-6xl font-semibold tabular-nums">
        <CountUp value={value} format={format} delay={delay} />
      </div>
      <div className="placard text-center text-[9px]">{label}</div>
    </div>
  )
}

function SmallReadout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="readout px-3 py-1.5 font-mono text-2xl font-semibold tabular-nums">
        {children}
      </div>
      <div className="placard text-center text-[8px]">{label}</div>
    </div>
  )
}

/** The console readout bank after a run. */
export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="module flex flex-wrap items-start gap-x-8 gap-y-4 p-5 pt-4">
      <BigReadout label="words per minute" value={metrics.wpm} format={fmtInt} />
      <BigReadout label="accuracy" value={metrics.accuracy} format={fmtPercent} delay={0.1} />
      <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1">
        <SmallReadout label="raw">
          <CountUp value={metrics.raw} format={fmtInt} delay={0.2} />
        </SmallReadout>
        <SmallReadout label="consistency">
          <CountUp value={metrics.consistency} format={fmtPercent} delay={0.25} />
        </SmallReadout>
        <SmallReadout label="time">{fmtClock(metrics.seconds)}</SmallReadout>
        <SmallReadout label="chars">
          {metrics.correctChars}/{metrics.totalChars}
        </SmallReadout>
      </div>
    </div>
  )
}
