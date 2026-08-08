import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { TerminalFrame } from '../components/terminal/TerminalFrame'
import { KeyHint } from '../components/ui/Kbd'
import { allCommands } from '../data/commands'
import { allFlags } from '../data/flags'
import { filterPool } from '../data/generator'
import { ClozeQuestion } from '../learn/components/ClozeQuestion'
import { FlagBreakdown } from '../learn/components/FlagBreakdown'
import { FlagRecallQuestion } from '../learn/components/FlagRecallQuestion'
import { McQuestion } from '../learn/components/McQuestion'
import { RecallQuestion } from '../learn/components/RecallQuestion'
import { ReinforceLine } from '../learn/components/ReinforceLine'
import { RoundProgress } from '../learn/components/RoundProgress'
import { Scrollback } from '../learn/components/Scrollback'
import { isMcType, type LearnSummary } from '../learn/learnReducer'
import { buildStudyItems } from '../learn/studyItems'
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
  const pools = useMemo(() => {
    const commands = filterPool(allCommands, settings.categories, settings.difficulties)
    const cats = new Set(settings.categories)
    const diffs = new Set(settings.difficulties)
    const flags = allFlags.filter((f) => cats.has(f.category) && diffs.has(f.difficulty))
    return {
      commands: commands.length > 0 ? commands : allCommands,
      flags,
    }
  }, [settings])

  const items = useMemo(
    () => buildStudyItems(pools.commands, pools.flags, settings.learnScope),
    [pools, settings.learnScope],
  )

  const { state, tabArmed, choose, advance } = useLearnSession(items, pools, {
    onSummary,
    onQuit,
    onRestart,
  })
  const q = state.queue[0]
  const phase = state.phase

  // During feedback the queue has already advanced — always render the
  // question the phase carries, or the leaked next question flashes with
  // the previous answer's highlights.
  const displayQ =
    phase.name === 'feedback' || phase.name === 'recall-diff' ? phase.question : q

  const viewKey =
    phase.name === 'round-complete'
      ? `round-${state.roundsCompleted}`
      : phase.name === 'reinforce'
        ? `reinforce-${state.answered.length}`
        : displayQ
          ? `q-${displayQ.uid}`
          : 'empty'

  // Flag breakdown: shown once a command question has been answered
  const breakdownEntry =
    (phase.name === 'feedback' || phase.name === 'recall-diff') &&
    displayQ?.item.kind === 'command'
      ? displayQ.item.entry
      : phase.name === 'reinforce' && state.reinforce
        ? state.reinforce.entry
        : null

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex min-h-8 items-end justify-between px-1">
        <RoundProgress batch={state.batch} levels={state.levels} />
        <span className="font-sans text-[12px] tracking-wide text-ink-soft uppercase select-none">
          round {state.roundsCompleted + 1} ·{' '}
          <span className="font-bold text-safety">{state.masteredThisSession.length}</span>{' '}
          mastered
        </span>
      </div>

      <TerminalFrame title="termtype — learn">
        <div
          data-learn-phase={phase.name}
          data-uid={displayQ?.uid ?? ''}
          data-qtype={displayQ?.qtype ?? ''}
          data-answer={displayQ?.answer}
          data-correct-option={
            displayQ && isMcType(displayQ.qtype) ? displayQ.correctIndex : undefined
          }
          data-option-count={
            displayQ && isMcType(displayQ.qtype) ? displayQ.options?.length : undefined
          }
          className="flex min-h-[16rem] flex-col gap-4"
        >
          <Scrollback items={state.scrollback} promptSetting={settings.promptStyle} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', bounce: 0, visualDuration: 0.25 }}
            >
              {phase.name === 'round-complete' ? (
                <div className="terminal-text text-accent select-none">
                  round complete — {state.masteredThisSession.length} item
                  {state.masteredThisSession.length === 1 ? '' : 's'} mastered so far.
                  <span className="text-dim"> next round loading…</span>
                </div>
              ) : phase.name === 'reinforce' && state.reinforce ? (
                <ReinforceLine
                  reinforce={state.reinforce}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                />
              ) : displayQ && isMcType(displayQ.qtype) ? (
                <McQuestion
                  question={displayQ}
                  phase={phase}
                  onChoose={choose}
                  onContinue={advance}
                />
              ) : displayQ && displayQ.qtype === 'cloze' ? (
                <ClozeQuestion
                  question={displayQ}
                  input={state.input}
                  phase={phase}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                  onContinue={advance}
                />
              ) : displayQ && displayQ.qtype === 'flag-recall' ? (
                <FlagRecallQuestion
                  question={displayQ}
                  input={state.input}
                  phase={phase}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                  onContinue={advance}
                />
              ) : displayQ ? (
                <RecallQuestion
                  question={displayQ}
                  input={state.input}
                  phase={phase}
                  promptSetting={settings.promptStyle}
                  caretStyle={settings.caretStyle}
                />
              ) : null}

              {breakdownEntry && (
                <FlagBreakdown
                  text={breakdownEntry.text}
                  category={breakdownEntry.category}
                />
              )}
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
