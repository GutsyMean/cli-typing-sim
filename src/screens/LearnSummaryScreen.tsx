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
        <h2 className="quoted text-3xl text-nylon">sold out</h2>
        <p className="text-[15px] font-semibold text-nylon">
          every command in your selected categories and difficulties is already at full
          mastery.{' '}
          <span className="font-normal text-nylon-soft">
            widen the selection on the config screen — or reset progress if you want to
            drill them again.
          </span>
        </p>
        <KeyHint keys={['esc']} label="back to config" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-7">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <div className="text-8xl leading-none font-extrabold tracking-tight text-nylon tabular-nums">
            {summary.mastered}
          </div>
          <div className="quoted mt-1.5 inline-block bg-nylon px-2 py-0.5 text-[11px] text-cotton">
            commands mastered
          </div>
        </div>
        <div className="pb-1 text-[13px] font-semibold text-nylon-soft">
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
              <div key={t} className="plate p-3.5">
                <div className="text-[10px] font-extrabold text-nylon-soft uppercase">
                  &ldquo;{typeLabel[t]}&rdquo;
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-nylon tabular-nums">
                  {fmtPercent((s.correct / s.total) * 100)}
                </div>
                <div className="text-xs text-nylon-soft">
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
          <div className="mb-3 flex items-center gap-3">
            <h3 className="quoted text-[15px] text-nylon">needs more work</h3>
            <span aria-hidden className="hazard h-2 flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            {summary.weakest.map((w) => (
              <div
                key={w.label}
                className="plate flex items-baseline justify-between gap-4 px-3.5 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-bold text-nylon">
                    {w.label}
                  </div>
                  <div className="truncate text-xs text-nylon-soft">{w.desc}</div>
                </div>
                <span className="ziptag shrink-0 text-[10px]">×{w.misses} missed</span>
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
