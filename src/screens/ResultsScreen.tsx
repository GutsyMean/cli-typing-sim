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
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="invert px-2 py-0.5">
          {settings.mode === 'timed'
            ? `${settings.duration}s sprint`
            : settings.mode === 'endless'
              ? 'endless session'
              : `${settings.commandCount} commands`}
        </span>
        {settings.categories.map((c) => (
          <span key={c} className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-ink">
            {categoryLabel(c)}
          </span>
        ))}
      </div>

      <StatCards metrics={metrics} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.18, ease: 'easeOut' }}
        className="window"
      >
        <div className="titlebar">
          <span className="closebox" aria-hidden />
          <span className="titlebar-chip">wpm over time</span>
        </div>
        <div className="p-5">
          <WpmChart bins={metrics.bins} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.18, ease: 'easeOut' }}
      >
        <ErrorBreakdown metrics={metrics} />
      </motion.div>

      <div className="window flex items-center justify-center gap-6 p-3">
        <KeyHint keys={['enter']} label="next test" />
        <KeyHint keys={['esc']} label="config" />
      </div>

      <p className="window mx-auto w-fit px-4 py-2 text-center text-[11px] text-ink">
        wpm counts correct characters over active typing time — pauses between commands
        (after the last character and before the next one) don&apos;t count against you.
      </p>
    </div>
  )
}
