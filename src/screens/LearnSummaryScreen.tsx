import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { KeyHint } from '../components/ui/Kbd'
import { fmtPercent } from '../lib/format'
import type { LearnSummary } from '../learn/learnReducer'
import type { QType } from '../learn/questions'

const typeLabel: Record<QType, string> = {
  mc: 'multiple choice',
  cloze: 'fill the blank',
  recall: 'full recall',
  'flag-mc': 'pick the flag',
  'flag-which': 'flag meaning',
  'flag-recall': 'type the flag',
}

export function LearnSummaryScreen({
  summary,
  finishedAt,
  onAgain,
  onHome,
}: {
  summary: LearnSummary
  /** performance.now() at the moment the session ended */
  finishedAt: number
  onAgain: () => void
  onHome: () => void
}) {
  // Typing-momentum grace anchored to when the session actually finished —
  // never to component mount, which can be delayed by screen transitions.
  const callbacksRef = useRef({ onAgain, onHome })
  callbacksRef.current = { onAgain, onHome }
  useEffect(() => {
    const armedAt = finishedAt + 400
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== 'Escape') return
      e.preventDefault()
      if (performance.now() < armedAt) return
      if (e.key === 'Enter') callbacksRef.current.onAgain()
      else callbacksRef.current.onHome()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finishedAt])

  if (summary.nothingToLearn) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 pt-16 text-center">
        <h2 className="font-mono text-3xl font-bold text-safety">all mastered ✓</h2>
        <p className="font-sans text-[15px] text-ink-soft">
          every command in your selected categories and difficulties is already at full
          mastery. widen the selection on the config screen — or reset progress if you
          want to drill them again.
        </p>
        <div className="flex items-center gap-6">
          <KeyHint keys={['esc']} label="back to config" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="form-rule pt-3">
        <div className="font-sans text-[12px] font-bold tracking-[0.16em] text-ink-soft uppercase">
          score report — items mastered
        </div>
        <div className="headline text-[clamp(4rem,10vw,6rem)] text-safety tabular-nums">
          {summary.mastered}
        </div>
        <div className="mt-1 font-sans text-sm text-ink-soft">
          {summary.totalAnswered} answers across {summary.roundsCompleted} completed round
          {summary.roundsCompleted === 1 ? '' : 's'}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {(Object.keys(typeLabel) as QType[])
          .filter((t) => summary.byType[t].total > 0)
          .map((t) => {
            const s = summary.byType[t]
            return (
              <div key={t} className="border border-ink/40 bg-paper-hi p-4">
                <div className="font-sans text-xs font-medium text-ink-soft">{typeLabel[t]}</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-ink tabular-nums">
                  {fmtPercent((s.correct / s.total) * 100)}
                </div>
                <div className="font-sans text-xs text-ink-soft">
                  {s.correct}/{s.total} correct
                </div>
              </div>
            )
          })}
      </motion.div>

      {summary.weakest.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-3 font-sans text-sm font-medium text-ink-soft">
            needs more work
          </h3>
          <div className="flex flex-col gap-2">
            {summary.weakest.map((w) => (
              <div
                key={w.label}
                className="flex items-baseline justify-between gap-4 border border-ink/40 bg-paper-hi px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm text-ink">{w.label}</div>
                  <div className="truncate font-sans text-xs text-ink-soft">{w.desc}</div>
                </div>
                <span className="shrink-0 font-sans text-xs text-spec-blue">
                  ×{w.misses} missed
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-center gap-6 pt-2">
        <KeyHint keys={['enter']} label="learn more" />
        <KeyHint keys={['esc']} label="config" />
      </div>
    </div>
  )
}
