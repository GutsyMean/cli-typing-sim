import { useEffect, useState } from 'react'
import { activeTypingMs } from '../../engine/metrics'
import type { EngineState } from '../../engine/typingReducer'
import { fmtClock, fmtInt } from '../../lib/format'
import { StepStrip } from './StepStrip'

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

/** Red segmented readout with its silkscreen label. */
function Readout({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex flex-col gap-1">
      <span className="tempo px-3 py-1 font-mono text-xl font-bold tabular-nums">
        {value}
      </span>
      <span className="silk text-center text-[8px]">{label}</span>
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

  // the chase light runs on your keystrokes: one step per typed character
  const typed = state.keystrokes.filter((k) => k.kind === 'char')
  const lastChar = typed[typed.length - 1]
  const step = typed.length === 0 ? null : (typed.length - 1) % 16

  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-2 select-none">
      <Readout
        label={state.config.mode === 'commands' ? 'cmds' : 'time'}
        value={progress}
      />
      {state.config.mode === 'endless' && (
        <Readout label="cmds" value={String(state.lineIndex)} />
      )}
      <Readout label="tempo · wpm" value={fmtInt(wpm)} />
      <div className="flex flex-col gap-1 pt-1.5">
        <StepStrip
          lit={step}
          idle={state.status === 'idle'}
          error={lastChar ? !lastChar.correct : false}
        />
        <span className="silk text-center text-[8px]">your cadence</span>
      </div>
    </div>
  )
}
