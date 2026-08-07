import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from '../../settings/settingsStore'
import { Segment } from '../ui/Segment'

export function ConfigBar() {
  const mode = useSettings((s) => s.mode)
  const duration = useSettings((s) => s.duration)
  const commandCount = useSettings((s) => s.commandCount)
  const difficulties = useSettings((s) => s.difficulties)
  const behavior = useSettings((s) => s.behavior)
  const set = useSettings((s) => s.set)
  const toggleDifficulty = useSettings((s) => s.toggleDifficulty)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <Segment
        groupId="mode"
        options={[
          { value: 'timed', label: 'timed' },
          { value: 'commands', label: 'commands' },
        ]}
        value={mode}
        onChange={(v) => set('mode', v)}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.15 }}
        >
          {mode === 'timed' ? (
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
          ) : (
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
          )}
        </motion.div>
      </AnimatePresence>

      <span className="h-6 w-px bg-edge" />

      <div className="inline-flex rounded-lg border border-edge bg-surface p-1">
        {([1, 2, 3] as const).map((d) => {
          const active = difficulties.includes(d)
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggleDifficulty(d)}
              className={`rounded-md px-3 py-1.5 font-sans text-[13px] font-medium transition-colors duration-150 ${
                active ? 'bg-raised text-accent' : 'text-dim hover:text-fg'
              }`}
            >
              {d === 1 ? 'basic' : d === 2 ? 'daily driver' : 'wizard'}
            </button>
          )
        })}
      </div>

      <span className="h-6 w-px bg-edge" />

      <Segment
        groupId="behavior"
        options={[
          { value: 'forgiving', label: 'forgiving' },
          { value: 'stop-on-error', label: 'stop on error' },
        ]}
        value={behavior}
        onChange={(v) => set('behavior', v)}
      />
    </div>
  )
}
