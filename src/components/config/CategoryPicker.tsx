import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** Destinations list: followed routes stay lit in yellow with a filled arrow. */
export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className={`flex items-center gap-2 px-3 py-2 text-left ${
              active
                ? 'bg-sign text-board'
                : 'border border-hall-line bg-white text-board-soft hover:border-board-soft'
            }`}
          >
            <span aria-hidden className="text-[15px] leading-none font-bold">
              {active ? '→' : ''}
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate font-mono text-[13px] font-bold ${
                  active ? 'text-board' : 'text-board'
                }`}
              >
                {cat.label}
              </span>
              <span
                className={`block truncate text-[11px] ${
                  active ? 'font-bold text-board' : 'text-board-soft'
                }`}
              >
                {cat.blurb}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
