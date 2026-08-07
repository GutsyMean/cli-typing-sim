import { animate } from 'motion/react'
import { useEffect, useState } from 'react'
import type { TestMetrics } from '../../engine/metrics'
import { fmt1, fmtClock, fmtInt, fmtPercent } from '../../lib/format'

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
    <div>
      <div className="font-sans text-sm font-medium text-dim">{label}</div>
      <div className="font-mono text-6xl font-bold text-accent tabular-nums">
        <CountUp value={value} format={format} delay={delay} />
      </div>
    </div>
  )
}

function SmallStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-sans text-xs font-medium text-faint">{label}</div>
      <div className="font-mono text-2xl font-semibold text-fg tabular-nums">{children}</div>
    </div>
  )
}

export function StatCards({ metrics }: { metrics: TestMetrics }) {
  return (
    <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
      <BigStat label="wpm" value={metrics.wpm} format={fmtInt} />
      <BigStat label="acc" value={metrics.accuracy} format={fmtPercent} delay={0.1} />
      <div className="flex gap-x-10">
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

export function fmtWpm(n: number): string {
  return fmt1(n)
}
