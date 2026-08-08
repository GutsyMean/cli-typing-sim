import { useEffect, useState } from 'react'
import { activeTypingMs } from '../../engine/metrics'
import type { EngineState } from '../../engine/typingReducer'
import { fmtClock, fmtInt } from '../../lib/format'

function liveWpm(state: EngineState, now: number): number {
  if (state.startedAt === null) return 0
  const activeMs = activeTypingMs(state.keystrokes, now - state.startedAt)
  const minutes = Math.max(activeMs / 60000, 1 / 60)
  const correct = state.keystrokes.reduce(
    (n, k) => (k.kind === 'char' && k.correct ? n + 1 : n),
    0,
  )
  return correct / 5 / minutes
}

function Meter({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink bg-paper-hi px-3 py-1">
      <div className="font-sans text-[9px] font-bold tracking-[0.16em] text-ink-soft uppercase">
        {label}
      </div>
      <div className="font-mono text-xl leading-tight font-semibold text-ink tabular-nums">
        {value}
      </div>
    </div>
  )
}

export function LiveStats({ state }: { state: EngineState }) {
  const [, force] = useState(0)
  useEffect(() => {
    if (state.status !== 'running') return
    const id = window.setInterval(() => force((n) => n + 1), 500)
    return () => window.clearInterval(id)
  }, [state.status])

  const now = performance.now()
  const wpm = state.status === 'running' ? liveWpm(state, now) : 0
  const elapsed =
    state.startedAt === null ? 0 : ((state.endedAt ?? now) - state.startedAt) / 1000

  const progress =
    state.config.mode === 'timed'
      ? fmtClock(Math.max(0, state.config.durationMs / 1000 - elapsed))
      : state.config.mode === 'endless'
        ? fmtClock(elapsed)
        : `${Math.min(state.lineIndex + 1, state.config.commandCount)}/${state.config.commandCount}`

  return (
    <div className="flex items-stretch gap-2 select-none">
      <Meter
        label={
          state.config.mode === 'timed'
            ? 'time left'
            : state.config.mode === 'endless'
              ? 'elapsed'
              : 'progress'
        }
        value={progress}
      />
      {state.config.mode === 'endless' && (
        <Meter label="commands" value={String(state.lineIndex)} />
      )}
      <Meter label="words/min" value={fmtInt(wpm)} />
    </div>
  )
}
