import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** Command sets as desktop items: checkbox + name; checked = selected. */
export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className="group flex items-start gap-2 py-1 text-left"
          >
            <span
              aria-hidden
              className="mt-0.5 flex size-[15px] shrink-0 items-center justify-center border-2 border-ink bg-paper"
            >
              {active && (
                <svg viewBox="0 0 10 10" className="size-[9px]">
                  <path
                    d="M1.5 1.5l7 7M8.5 1.5l-7 7"
                    stroke="var(--w-ink)"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate font-mono text-[16px] text-ink ${
                  active ? 'font-bold' : 'group-hover:underline'
                }`}
              >
                {cat.label}
              </span>
              <span className="block truncate text-[14px] text-ink">{cat.blurb}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
