import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** The annunciator bank: each command set is a lamp; latched sets glow. */
export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className={`lens px-3 py-2 text-left ${active ? 'lens-lit' : ''}`}
          >
            <span className="block truncate font-mono text-[13px] font-semibold">
              {cat.label}
            </span>
            <span
              className={`block truncate text-[11px] ${
                active ? '' : 'text-legend-dim'
              }`}
            >
              {cat.blurb}
            </span>
          </button>
        )
      })}
    </div>
  )
}
