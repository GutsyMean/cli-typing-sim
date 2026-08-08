import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** Crate labels: the sets you're taking keep their zip tie on. */
export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className={`relative px-3 py-2 text-left ${
              active ? 'nylon' : 'plate hover:bg-cotton'
            }`}
          >
            <span
              className={`block truncate font-mono text-[13px] font-bold ${
                active ? 'text-cotton' : 'text-nylon'
              }`}
            >
              {cat.label}
            </span>
            <span
              className={`block truncate text-[11px] ${
                active ? 'text-cotton/75' : 'text-nylon-soft'
              }`}
            >
              {cat.blurb}
            </span>
            {active && (
              <span aria-hidden className="ziptag absolute -top-2 -right-1.5 text-[8px]">
                in
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
