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

function BigStat({
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
    <div className="lcd px-5 py-3">
      <div className="font-display text-[9px] tracking-[0.16em] text-lcd-dim uppercase">
        {label}
      </div>
      <div className="font-mono text-6xl font-bold tabular-nums">
        <CountUp value={value} format={format} delay={delay} />
      </div>
    </div>
  )
}

function SmallStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="lcd px-4 py-2.5">
      <div className="font-display text-[8px] tracking-[0.16em] text-lcd-dim uppercase">
        {label}
      </div>
      <div className="font-mono text-2xl font-semibold tabular-nums">{children}</div>
    </div>
  )
}

export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <BigStat label="wpm" value={metrics.wpm} format={fmtInt} />
      <BigStat label="acc" value={metrics.accuracy} format={fmtPercent} delay={0.1} />
      <div className="flex flex-wrap gap-3">
        <SmallStat label="raw">
          <CountUp value={metrics.raw} format={fmtInt} delay={0.2} />
        </SmallStat>
        <SmallStat label="consistency">
          <CountUp value={metrics.consistency} format={fmtPercent} delay={0.25} />
        </SmallStat>
        <SmallStat label="time">{fmtClock(metrics.seconds)}</SmallStat>
        <SmallStat label="chars">
          {metrics.correctChars}/{metrics.totalChars}
        </SmallStat>
      </div>
    </div>
  )
}
