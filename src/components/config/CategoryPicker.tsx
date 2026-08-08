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
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className={`px-3 py-2 text-left ${active ? 'key-down' : 'key-up'}`}
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden className={`led ${active ? 'led-on' : ''}`} />
              <span
                className={`block truncate font-mono text-[13px] font-semibold ${
                  active ? 'text-teal-deep' : 'text-ink'
                }`}
              >
                {cat.label}
              </span>
            </span>
            <span className="mt-0.5 block truncate font-sans text-[11px] text-ink-faint">
              {cat.blurb}
            </span>
          </button>
        )
      })}
    </div>
  )
}
