import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ErrorBreakdown } from '../components/results/ErrorBreakdown'
import { StatCards } from '../components/results/StatCards'
import { WpmChart } from '../components/results/WpmChart'
import { KeyHint } from '../components/ui/Kbd'
import { categoryLabel } from '../data/commands'
import type { TestResult } from './TestScreen'
import { SignArrow } from '../components/ui/signage'

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
      <div className="sign-band sign-hung flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-[13px] font-bold">
        <span>Arrivals</span>
        <span aria-hidden>·</span>
        <span>
          {settings.mode === 'timed'
            ? `${settings.duration}s sprint`
            : settings.mode === 'endless'
              ? 'endless session'
              : `${settings.commandCount} commands`}
        </span>
        {settings.categories.map((c) => (
          <span key={c} className="font-mono font-bold">
            {categoryLabel(c)}
          </span>
        ))}
        <SignArrow className="ml-auto size-5 shrink-0" />
      </div>

      <StatCards metrics={metrics} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="board p-5"
      >
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

      <p className="text-center text-[12px] text-board-soft">
        wpm counts correct characters over active typing time — pauses between commands
        (after the last character and before the next one) don&apos;t count against you.
      </p>
    </div>
  )
}
