import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { CommandLine } from '../components/terminal/CommandLine'
import { TerminalFrame } from '../components/terminal/TerminalFrame'
import { KeyHint } from '../components/ui/Kbd'
import { LiveStats } from '../components/ui/LiveStats'
import { allCommands } from '../data/commands'
import { createCommandStream, filterPool } from '../data/generator'
import { computeMetrics, type TestMetrics } from '../engine/metrics'
import type { EngineConfig, EngineState } from '../engine/typingReducer'
import { useTypingEngine } from '../engine/useTypingEngine'
import { useHistory } from '../history/historyStore'
import { useSettings, type Settings } from '../settings/settingsStore'

export interface TestResult {
  metrics: TestMetrics
  settings: Pick<
    Settings,
    'mode' | 'duration' | 'commandCount' | 'categories' | 'difficulties'
  >
}

const BACK_WINDOW = 4
const AHEAD_WINDOW = 2

const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function TestScreen({
  onFinish,
  onRestart,
}: {
  onFinish: (result: TestResult) => void
  onRestart: () => void
}) {
  // Settings are snapshotted for the lifetime of this test instance —
  // the screen fully remounts (seed key) on restart.
  const settings = useMemo(() => useSettings.getState(), [])
  const addHistory = useHistory((s) => s.add)

  const stream = useMemo(() => {
    const pool = filterPool(allCommands, settings.categories, settings.difficulties)
    return createCommandStream(pool.length > 0 ? pool : allCommands)
  }, [settings])

  const config = useMemo<EngineConfig>(
    () => ({
      behavior: settings.behavior,
      mode: settings.mode,
      durationMs: settings.duration * 1000,
      commandCount: settings.commandCount,
    }),
    [settings],
  )

  const { state, capsLock, tabArmed } = useTypingEngine(stream, config, {
    onRestart,
    onFinish: (final: EngineState) => {
      if (final.startedAt === null || final.endedAt === null) return
      const metrics = computeMetrics(final.keystrokes, final.endedAt - final.startedAt)
      const result: TestResult = {
        metrics,
        settings: {
          mode: settings.mode,
          duration: settings.duration,
          commandCount: settings.commandCount,
          categories: settings.categories,
          difficulties: settings.difficulties,
        },
      }
      addHistory({
        ts: Date.now(),
        wpm: metrics.wpm,
        raw: metrics.raw,
        accuracy: metrics.accuracy,
        consistency: metrics.consistency,
        mode: settings.mode,
        amount: settings.mode === 'timed' ? settings.duration : settings.commandCount,
        categories: settings.categories,
        difficulties: settings.difficulties,
      })
      onFinish(result)
    },
  })

  const from = Math.max(0, state.lineIndex - BACK_WINDOW)
  const to = Math.min(state.lines.length, state.lineIndex + 1 + AHEAD_WINDOW)
  const visible = state.lines.slice(from, to)

  const title =
    settings.mode === 'timed'
      ? `termtype — ${settings.duration}s sprint`
      : `termtype — ${settings.commandCount} commands`

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex min-h-10 items-end justify-between px-1">
        {settings.showLiveStats ? <LiveStats state={state} /> : <span />}
        <AnimatePresence>
          {capsLock && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="rounded-md bg-err-bg px-3 py-1 font-sans text-sm font-semibold text-err"
            >
              caps lock is on
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <TerminalFrame title={title}>
        <div className="relative min-h-[16rem]">
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((line, i) => {
                const index = from + i
                return (
                  <motion.div
                    key={index}
                    layout="position"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 45 }}
                  >
                    <CommandLine
                      line={line}
                      state={
                        index < state.lineIndex
                          ? 'done'
                          : index === state.lineIndex
                            ? 'active'
                            : 'upcoming'
                      }
                      promptSetting={settings.promptStyle}
                      caretStyle={settings.caretStyle}
                      caretBlink={settings.caretBlink && state.status === 'idle'}
                      showCaret={index === state.lineIndex && state.status !== 'finished'}
                      showDesc={settings.showDescriptions}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {state.status === 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 bottom-0 pb-1 text-center font-sans text-sm text-faint select-none"
              >
                start typing to begin — press{' '}
                <span className="font-semibold text-dim">enter</span> after each command
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TerminalFrame>

      <div className="mt-5 flex items-center justify-center gap-6">
        <KeyHint keys={['esc']} label="restart" />
        <KeyHint keys={['tab', 'enter']} label={tabArmed ? 'restart armed…' : 'restart'} />
      </div>

      {isTouchDevice && (
        <p className="mt-4 text-center font-sans text-sm text-dim">
          termtype needs a physical keyboard — grab your laptop for the full experience.
        </p>
      )}
    </div>
  )
}
