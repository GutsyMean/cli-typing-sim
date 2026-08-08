import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from '../../settings/settingsStore'
import { Segment } from '../ui/Segment'

const difficultyInfo = [
  {
    value: 1 as const,
    label: 'basic',
    hint: 'short everyday commands — ls -la, git status, docker ps',
  },
  {
    value: 2 as const,
    label: 'daily driver',
    hint: 'common flags and pipes — git rebase -i HEAD~3, ps aux | grep nginx',
  },
  {
    value: 3 as const,
    label: 'wizard',
    hint: 'long, flag-heavy one-liners — rsync/awk/kubectl monsters up to 90 chars',
  },
]

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-board-soft uppercase tracking-wide select-none">
        {label}
      </span>
      {children}
    </div>
  )
}

export function ConfigBar() {
  const mode = useSettings((s) => s.mode)
  const learnScope = useSettings((s) => s.learnScope)
  const duration = useSettings((s) => s.duration)
  const commandCount = useSettings((s) => s.commandCount)
  const difficulties = useSettings((s) => s.difficulties)
  const behavior = useSettings((s) => s.behavior)
  const set = useSettings((s) => s.set)
  const toggleDifficulty = useSettings((s) => s.toggleDifficulty)

  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
      <Group label="Mode">
        <Segment
          groupId="mode"
          options={[
            { value: 'timed', label: 'timed', hint: 'race the clock' },
            { value: 'commands', label: 'commands', hint: 'type a fixed number of commands' },
            { value: 'endless', label: 'endless', hint: 'type as long as you like — esc shows your results' },
            {
              value: 'learn',
              label: 'learn',
              hint: 'quizlet-style mastery: multiple choice → fill the blank → full recall',
            },
          ]}
          value={mode}
          onChange={(v) => set('mode', v)}
        />
      </Group>

      <AnimatePresence mode="wait" initial={false}>
        {mode !== 'endless' && mode !== 'learn' && (
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {mode === 'timed' ? (
              <Group label="Duration">
                <Segment
                  groupId="duration"
                  options={[
                    { value: 15, label: '15s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '60s' },
                    { value: 120, label: '120s' },
                  ]}
                  value={duration}
                  onChange={(v) => set('duration', v)}
                />
              </Group>
            ) : (
              <Group label="Length">
                <Segment
                  groupId="count"
                  options={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                  ]}
                  value={commandCount}
                  onChange={(v) => set('commandCount', v)}
                />
              </Group>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'learn' && (
        <Group label="Study">
          <Segment
            groupId="learnScope"
            options={[
              { value: 'commands', label: 'commands', hint: 'learn whole commands' },
              { value: 'flags', label: 'flags', hint: 'learn what individual flags do' },
              { value: 'both', label: 'both', hint: 'commands and their flags together' },
            ]}
            value={learnScope}
            onChange={(v) => set('learnScope', v)}
          />
        </Group>
      )}

      <Group label="Difficulty — pick one or more">
        <div className="board inline-flex flex-wrap">
          {difficultyInfo.map((d, i) => {
            const active = difficulties.includes(d.value)
            return (
              <button
                key={d.value}
                type="button"
                title={d.hint}
                aria-pressed={active}
                onClick={() => toggleDifficulty(d.value)}
                className={`px-3.5 py-1.5 text-[14px] font-bold ${
                  i > 0 ? 'border-l border-white/25' : ''
                } ${active ? 'bg-sign text-board' : 'text-white hover:bg-white/15'}`}
              >
                {active && (
                  <span aria-hidden className="mr-1.5">
                    ✓
                  </span>
                )}
                {d.label}
              </button>
            )
          })}
        </div>
      </Group>

      {mode !== 'learn' && (
        <Group label="On mistakes">
          <Segment
            groupId="behavior"
            options={[
              {
                value: 'forgiving',
                label: 'forgiving',
                hint: 'wrong characters advance the caret; go back and fix them if you want',
              },
              {
                value: 'stop-on-error',
                label: 'stop on error',
                hint: 'the caret sticks until you type the correct character',
              },
            ]}
            value={behavior}
            onChange={(v) => set('behavior', v)}
          />
        </Group>
      )}
    </div>
  )
}
