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

/** Amber segment readouts on the console. */
function Readout({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex flex-col gap-1">
      <span className="readout px-3 py-1 font-mono text-xl font-semibold tabular-nums">
        {value}
      </span>
      <span className="placard text-center text-[8px]">{label}</span>
    </span>
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
    <div className="flex items-start gap-2.5 select-none">
      <Readout
        label={state.config.mode === 'commands' ? 'cmds' : 'time'}
        value={progress}
      />
      {state.config.mode === 'endless' && (
        <Readout label="cmds" value={String(state.lineIndex)} />
      )}
      <Readout label="wpm" value={fmtInt(wpm)} />
    </div>
  )
}
