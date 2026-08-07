import { motion } from 'motion/react'
import { useEffect } from 'react'
import { ErrorBreakdown } from '../components/results/ErrorBreakdown'
import { StatCards } from '../components/results/StatCards'
import { WpmChart } from '../components/results/WpmChart'
import { KeyHint } from '../components/ui/Kbd'
import { categoryLabel } from '../data/commands'
import type { TestResult } from './TestScreen'

export function ResultsScreen({
  result,
  onNext,
  onHome,
}: {
  result: TestResult
  onNext: () => void
  onHome: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onHome()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext, onHome])

  const { metrics, settings } = result

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-faint">
        <span className="rounded-md bg-surface px-2 py-1">
          {settings.mode === 'timed'
            ? `${settings.duration}s sprint`
            : `${settings.commandCount} commands`}
        </span>
        {settings.categories.map((c) => (
          <span key={c} className="rounded-md bg-surface px-2 py-1 font-mono">
            {categoryLabel(c)}
          </span>
        ))}
      </div>

      <StatCards metrics={metrics} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-edge bg-term p-5"
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

      <p className="text-center font-sans text-[11px] text-faint">
        wpm counts correct characters only; the enter key between commands is not counted.
      </p>
    </div>
  )
}
