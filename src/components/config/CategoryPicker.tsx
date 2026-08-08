import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** Order-form checkbox grid: ruled cells, square ticks, no cards. */
export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 border-t border-l border-ink sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggle(cat.id)}
            className={`group flex items-start gap-2.5 border-r border-b border-ink px-3 py-2.5 text-left transition-colors duration-100 ${
              active ? 'bg-paper-hi' : 'hover:bg-ink/5'
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 flex size-4 shrink-0 items-center justify-center border-2 ${
                active ? 'border-ink bg-ink' : 'border-ink-soft group-hover:border-ink'
              }`}
            >
              {active && (
                <svg viewBox="0 0 10 10" className="size-3" aria-hidden>
                  <path d="M1.5 5.5l2.2 2.3L8.5 2" fill="none" stroke="var(--w-safety)" strokeWidth="2" />
                </svg>
              )}
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate font-mono text-[13px] font-semibold ${
                  active ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                }`}
              >
                {cat.label}
              </span>
              <span className="block truncate font-sans text-[11px] text-ink-soft/80">
                {cat.blurb}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
