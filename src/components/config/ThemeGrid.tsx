import { motion } from 'motion/react'
import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

export function ThemeGrid() {
  const current = useSettings((s) => s.theme)
  const set = useSettings((s) => s.set)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {themes.map((theme) => {
        const active = theme.id === current
        const v = theme.vars
        return (
          <motion.button
            key={theme.id}
            type="button"
            onClick={() => set('theme', theme.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`overflow-hidden rounded-lg border text-left transition-colors duration-150 ${
              active ? 'border-accent/70' : 'border-edge hover:border-faint'
            }`}
            style={{ background: v['--t-bg'] }}
          >
            <span className="flex items-center gap-1.5 px-3 pt-2.5">
              <span className="size-2.5 rounded-full" style={{ background: v['--t-accent'] }} />
              <span className="size-2.5 rounded-full" style={{ background: v['--t-p-path'] }} />
              <span className="size-2.5 rounded-full" style={{ background: v['--t-err'] }} />
            </span>
            <span
              className="block px-3 pb-2.5 pt-1.5 font-mono text-xs font-medium"
              style={{ color: v['--t-fg'] }}
            >
              {theme.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
