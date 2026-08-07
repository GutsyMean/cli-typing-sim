import { motion } from 'motion/react'
import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => toggle(cat.id)}
            whileTap={{ scale: 0.97 }}
            className={`rounded-lg border px-3 py-2 text-left transition-colors duration-150 ${
              active
                ? 'border-accent/60 bg-raised'
                : 'border-edge bg-surface hover:border-faint'
            }`}
          >
            <span
              className={`block font-mono text-[13px] font-semibold ${
                active ? 'text-accent' : 'text-fg'
              }`}
            >
              {cat.label}
            </span>
            <span className="block font-sans text-[11px] text-faint">{cat.blurb}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
