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
      <span className="font-sans text-[11px] font-bold tracking-[0.14em] text-ink uppercase select-none">
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
      <Group label="mode — mark one">
        <Segment
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
              <Group label="duration">
                <Segment
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
              <Group label="length">
                <Segment
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
        <Group label="study">
          <Segment
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

      <Group label="difficulty — mark all that apply">
        <div className="inline-flex flex-wrap items-stretch border border-ink bg-paper-hi">
          {difficultyInfo.map((d, i) => {
            const active = difficulties.includes(d.value)
            return (
              <button
                key={d.value}
                type="button"
                title={d.hint}
                onClick={() => toggleDifficulty(d.value)}
                className={`group flex items-center gap-2 px-3 py-1.5 font-sans text-[13px] font-semibold tracking-wide uppercase transition-colors duration-100 ${
                  i > 0 ? 'border-l border-ink/40' : ''
                } ${active ? 'bg-ink text-paper-hi' : 'text-ink-soft hover:bg-ink/10 hover:text-ink'}`}
              >
                <span
                  aria-hidden
                  className={`flex size-3.5 items-center justify-center border ${
                    active ? 'border-paper-hi' : 'border-ink-soft group-hover:border-ink'
                  }`}
                >
                  {active && (
                    <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden>
                      <path d="M1.5 5.5l2.2 2.3L8.5 2" fill="none" stroke="var(--w-safety)" strokeWidth="2.2" />
                    </svg>
                  )}
                </span>
                {d.label}
              </button>
            )
          })}
        </div>
      </Group>

      {mode !== 'learn' && (
        <Group label="on mistakes">
          <Segment
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
