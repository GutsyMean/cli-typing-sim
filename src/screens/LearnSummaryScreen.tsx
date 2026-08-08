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
      <div className="mx-auto w-full max-w-2xl pt-16">
        <div className="window">
          <div className="titlebar">
            <span className="closebox" aria-hidden />
            <span className="titlebar-chip">alert</span>
          </div>
          <div className="flex flex-col items-center gap-5 p-8 text-center">
            <h2 className="font-display text-2xl text-ink">all mastered</h2>
            <p className="text-[14px] text-ink">
              every command in your selected categories and difficulties is already at
              full mastery. widen the selection on the config screen — or reset progress
              if you want to drill them again.
            </p>
            <KeyHint keys={['esc']} label="back to config" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="window">
        <div className="titlebar">
          <span className="closebox" aria-hidden />
          <span className="titlebar-chip">session report</span>
        </div>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3 p-5">
          <div>
            <div className="font-display text-6xl leading-none text-ink tabular-nums">
              {summary.mastered}
            </div>
            <div className="mt-1 text-[12px] text-ink">commands mastered</div>
          </div>
          <div className="pb-1 text-[12px] text-ink">
            {summary.totalAnswered} answers across {summary.roundsCompleted} completed
            round{summary.roundsCompleted === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.18, ease: 'easeOut' }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {(Object.keys(typeLabel) as QType[])
          .filter((t) => summary.byType[t].total > 0)
          .map((t) => {
            const s = summary.byType[t]
            return (
              <div key={t} className="border-2 border-ink bg-paper p-3">
                <div className="text-[11px] text-ink">{typeLabel[t]}</div>
                <div className="mt-1 font-display text-2xl text-ink tabular-nums">
                  {fmtPercent((s.correct / s.total) * 100)}
                </div>
                <div className="text-[11px] text-ink">
                  {s.correct}/{s.total} correct
                </div>
              </div>
            )
          })}
      </motion.div>

      {summary.weakest.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.18, ease: 'easeOut' }}
          className="window"
        >
          <div className="titlebar">
            <span className="closebox" aria-hidden />
            <span className="titlebar-chip">needs more work</span>
          </div>
          <div className="flex flex-col divide-y-2 divide-ink/20">
            {summary.weakest.map((w) => (
              <div
                key={w.label}
                className="flex items-baseline justify-between gap-4 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-bold text-ink">
                    {w.label}
                  </div>
                  <div className="truncate text-xs text-ink">{w.desc}</div>
                </div>
                <span className="invert shrink-0 px-1.5 text-xs">
                  ×{w.misses} missed
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="window flex items-center justify-center gap-6 p-3">
        <KeyHint keys={['enter']} label="learn more" />
        <KeyHint keys={['esc']} label="config" />
      </div>
    </div>
  )
}
