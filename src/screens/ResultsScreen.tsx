import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ErrorBreakdown } from '../components/results/ErrorBreakdown'
import { StatCards } from '../components/results/StatCards'
import { WpmChart } from '../components/results/WpmChart'
import { KeyHint } from '../components/ui/Kbd'
import { categoryLabel } from '../data/commands'
import type { TestResult } from './TestScreen'

export function ResultsScreen({
  result,
  finishedAt,
  onNext,
  onHome,
}: {
  result: TestResult
  /** performance.now() at the moment the test ended */
  finishedAt: number
  onNext: () => void
  onHome: () => void
}) {
  // Grace period so typing momentum from the final second of a test can't
  // accidentally dismiss the results — anchored to when the test finished,
  // never to component mount, which can be delayed by screen transitions.
  const callbacksRef = useRef({ onNext, onHome })
  callbacksRef.current = { onNext, onHome }
  useEffect(() => {
    const armedAt = finishedAt + 400
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') return
      e.preventDefault()
      if (performance.now() < armedAt) return
      if (e.key === 'Escape') callbacksRef.current.onHome()
      else callbacksRef.current.onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finishedAt])

  const { metrics, settings } = result

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="placard text-[9px]">end of run</span>
        <span className="lens lens-lit px-2 py-0.5 text-[11px] uppercase">
          {settings.mode === 'timed'
            ? `${settings.duration}s sprint`
            : settings.mode === 'endless'
              ? 'endless session'
              : `${settings.commandCount} commands`}
        </span>
        {settings.categories.map((c) => (
          <span key={c} className="lens px-2 py-0.5 font-mono text-[11px]">
            {categoryLabel(c)}
          </span>
        ))}
      </div>

      <StatCards metrics={metrics} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="module p-4 pt-3"
      >
        <div className="placard mb-3 px-4 text-[9px]">wpm over time</div>
        <WpmChart bins={metrics.bins} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ErrorBreakdown metrics={metrics} />
      </motion.div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <KeyHint keys={['enter']} label="next test" />
        <KeyHint keys={['esc']} label="config" />
      </div>

      <p className="text-center text-[12px] text-legend-dim">
        wpm counts correct characters over active typing time — pauses between commands
        (after the last character and before the next one) don&apos;t count against you.
      </p>
    </div>
  )
}
