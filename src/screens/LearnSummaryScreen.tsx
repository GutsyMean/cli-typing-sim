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
        <div className="deck p-8 text-center">
          <h2 className="step mx-auto inline-block bg-key-red px-5 py-2.5 text-xl font-bold tracking-[0.12em] text-[#2a0507] uppercase">
            pattern complete
          </h2>
          <p className="mt-5 text-[15px] text-silk">
            every command in your selected categories and difficulties is already at full
            mastery.{' '}
            <span className="text-silk-dim">
              widen the selection on the config screen — or reset progress if you want to
              drill them again.
            </span>
          </p>
          <div className="mt-6 flex items-center justify-center">
            <KeyHint keys={['esc']} label="back to config" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="deck flex flex-wrap items-start gap-x-8 gap-y-3 p-5">
        <div className="flex flex-col gap-1.5">
          <div className="tempo px-5 py-2 font-mono text-6xl font-bold tabular-nums">
            {summary.mastered}
          </div>
          <div className="silk text-center text-[9px]">commands mastered</div>
        </div>
        <div className="pt-2 text-[13px] text-silk-dim">
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
              <div key={t} className="deck p-3.5">
                <div className="silk text-[8px]">{typeLabel[t]}</div>
                <div className="mt-1.5 font-mono text-2xl font-bold text-tempo tabular-nums">
                  {fmtPercent((s.correct / s.total) * 100)}
                </div>
                <div className="text-xs text-silk-dim">
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
          className="deck p-4"
        >
          <h3 className="silk mb-3 text-[9px]">needs more work</h3>
          <div className="flex flex-col gap-1.5">
            {summary.weakest.map((w) => (
              <div
                key={w.label}
                className="flex items-baseline justify-between gap-4 rounded-[4px] border border-deck-edge bg-chassis px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-bold text-silk">
                    {w.label}
                  </div>
                  <div className="truncate text-xs text-silk-dim">{w.desc}</div>
                </div>
                <span
                  className="shrink-0 rounded-[3px] px-1.5 py-0.5 text-xs font-bold"
                  style={{ background: 'var(--w-key-yellow)', color: '#241b02' }}
                >
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
