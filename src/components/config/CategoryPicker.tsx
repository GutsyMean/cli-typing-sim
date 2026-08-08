import { categories } from '../../data/commands'
import { useSettings } from '../../settings/settingsStore'

/** The sound bank: 15 pads quartered like the step row; armed pads light up. */
const quarterStyle = (i: number) =>
  i < 4
    ? 'bg-key-red text-[#2a0507]'
    : i < 8
      ? 'bg-key-orange text-[#2b1203]'
      : i < 12
        ? 'bg-key-yellow text-[#241b02]'
        : 'bg-key-white text-[#1c1c1a]'

export function CategoryPicker() {
  const selected = useSettings((s) => s.categories)
  const toggle = useSettings((s) => s.toggleCategory)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat, i) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(cat.id)}
            className={`step px-3 pt-2 pb-2.5 text-left ${quarterStyle(i)} ${
              active ? '' : 'step-off'
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[13px] font-bold">
                {cat.label}
              </span>
              <span aria-hidden className={`sled shrink-0 ${active ? 'sled-lit' : ''}`} />
            </span>
            <span className="mt-0.5 block truncate text-[11px] font-semibold opacity-80">
              {cat.blurb}
            </span>
          </button>
        )
      })}
    </div>
  )
}
