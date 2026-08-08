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
        <div className="sign-band sign-hung px-6 py-6 text-center">
          <h2 className="text-3xl font-bold">All routes cleared ✓</h2>
          <p className="mt-3 text-[15px] font-bold">
            every command in your selected categories and difficulties is already at full
            mastery. widen the selection on the config screen — or reset progress if you
            want to drill them again.
          </p>
          <div className="mt-5 flex items-center justify-center">
            <KeyHint keys={['esc']} label="back to config" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="board flex flex-wrap items-end gap-x-8 gap-y-3 px-6 py-5">
        <div className="flap">
          <div className="font-mono text-8xl leading-none font-bold text-sign tabular-nums">
            {summary.mastered}
          </div>
          <div className="mt-1 text-[13px] font-bold text-white uppercase">
            commands mastered
          </div>
        </div>
        <div className="pb-1 text-[13px] text-white">
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
              <div key={t} className="bg-white p-3.5 shadow-[0_8px_20px_-12px_rgba(23,24,28,0.35)]">
                <div className="text-[12px] font-bold text-board-soft uppercase tracking-wide">
                  {typeLabel[t]}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-board tabular-nums">
                  {fmtPercent((s.correct / s.total) * 100)}
                </div>
                <div className="text-xs text-board-soft">
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
          <div className="sign-band flex items-center justify-between px-4 py-2">
            <h3 className="text-[15px] font-bold">Needs more work</h3>
            <span aria-hidden className="text-lg leading-none font-bold">
              →
            </span>
          </div>
          <div className="flex flex-col divide-y divide-hall-line bg-white shadow-[0_8px_20px_-12px_rgba(23,24,28,0.35)]">
            {summary.weakest.map((w) => (
              <div
                key={w.label}
                className="flex items-baseline justify-between gap-4 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-bold text-board">
                    {w.label}
                  </div>
                  <div className="truncate text-xs text-board-soft">{w.desc}</div>
                </div>
                <span className="shrink-0 bg-closed px-1.5 py-0.5 text-xs font-bold text-white">
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
