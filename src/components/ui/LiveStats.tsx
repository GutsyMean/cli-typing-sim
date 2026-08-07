import { useEffect, useState } from 'react'
import type { EngineState } from '../../engine/typingReducer'
import { fmtClock, fmtInt } from '../../lib/format'

function liveWpm(state: EngineState, now: number): number {
  if (state.startedAt === null) return 0
  const minutes = Math.max((now - state.startedAt) / 60000, 1 / 60)
  const correct = state.keystrokes.reduce(
    (n, k) => (k.kind === 'char' && k.correct ? n + 1 : n),
    0,
  )
  return correct / 5 / minutes
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
      : `${Math.min(state.lineIndex + 1, state.config.commandCount)}/${state.config.commandCount}`

  return (
    <div className="flex items-baseline gap-6 font-mono text-accent select-none">
      <span className="text-2xl font-semibold tabular-nums">{progress}</span>
      <span className="text-2xl font-semibold tabular-nums">
        {fmtInt(wpm)}
        <span className="ml-1.5 text-sm text-dim">wpm</span>
      </span>
    </div>
  )
}
