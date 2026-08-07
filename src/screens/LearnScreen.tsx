import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { TerminalFrame } from '../components/terminal/TerminalFrame'
import { KeyHint } from '../components/ui/Kbd'
import { allCommands } from '../data/commands'
import { filterPool } from '../data/generator'
import { ClozeQuestion } from '../learn/components/ClozeQuestion'
import { McQuestion } from '../learn/components/McQuestion'
import { RecallQuestion } from '../learn/components/RecallQuestion'
import { ReinforceLine } from '../learn/components/ReinforceLine'
import { RoundProgress } from '../learn/components/RoundProgress'
import { Scrollback } from '../learn/components/Scrollback'
import type { LearnSummary } from '../learn/learnReducer'
import { useLearnSession } from '../learn/useLearnSession'
import { useSettings } from '../settings/settingsStore'

export function LearnScreen({
  onSummary,
  onQuit,
  onRestart,
}: {
  onSummary: (summary: LearnSummary) => void
  onQuit: () => void
  onRestart: () => void
}) {
  const settings = useMemo(() => useSettings.getState(), [])
  const pool = useMemo(() => {
    const filtered = filterPool(allCommands, settings.categories, settings.difficulties)
    return filtered.length > 0 ? filtered : allCommands
  }, [settings])

  const { state, tabArmed, choose, advance } = useLearnSession(pool, {
    onSummary,
    onQuit,
    onRestart,
  })
  const q = state.queue[0]
  const phase = state.phase

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex min-h-8 items-end justify-between px-1">
        <RoundProgress batch={state.batch} levels={state.levels} />
        <span className="font-sans text-sm text-dim select-none">
          round {state.roundsCompleted + 1} ·{' '}
          <span className="text-accent">{state.masteredThisSession.length}</span> mastered
        </span>
      </div>

      <TerminalFrame title="termtype — learn">
        <div data-learn-phase={phase.name} className="flex min-h-[16rem] flex-col gap-4">
          <Scrollback items={state.scrollback} promptSetting={settings.promptStyle} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${q?.key ?? 'done'}-${q?.qtype ?? ''}-${phase.name === 'reinforce' ? 'r' : 'q'}-${state.answered.length}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', bounce: 0, visualDuration: 0.25 }}
            >
              {phase.name === 'round-complete' ? (
                <div className="terminal-text text-accent select-none">
                  round complete — {state.masteredThisSession.length} command
                  {state.masteredThisSession.length === 1 ? '' : 's'} mastered so far.
                  <span className="text-dim"> next round loading…</span>
                </div>
              ) : phase.name === 'reinforce' && state.reinforce ? (
                <ReinforceLine
                  reinforce={state.reinforce}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                />
              ) : q && q.qtype === 'mc' ? (
                <McQuestion
                  question={q}
                  phase={phase}
                  onChoose={choose}
                  onContinue={advance}
                />
              ) : q && q.qtype === 'cloze' ? (
                <ClozeQuestion
                  question={q}
                  input={state.input}
                  phase={phase}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                  onContinue={advance}
                />
              ) : q ? (
                <RecallQuestion
                  question={q}
                  input={state.input}
                  phase={phase}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </TerminalFrame>

      <div className="mt-5 flex items-center justify-center gap-6">
        <KeyHint
          keys={['esc']}
          label={state.answered.length > 0 ? 'finish & see summary' : 'quit'}
        />
        <KeyHint keys={['tab', 'enter']} label={tabArmed ? 'restart armed…' : 'restart'} />
      </div>
    </div>
  )
}
