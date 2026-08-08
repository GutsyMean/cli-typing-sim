import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/** Fabric swatches: quoted name plates, zip tie on the fitted one. */
export function ThemeGrid() {
  const current = useSettings((s) => s.theme)
  const set = useSettings((s) => s.set)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {themes.map((theme) => {
        const active = theme.id === current
        const v = theme.vars
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={active}
            onClick={() => set('theme', theme.id)}
            className={`relative p-1.5 text-left ${active ? 'nylon' : 'plate hover:bg-cotton'}`}
          >
            <span
              className="block px-2.5 py-2.5 font-mono text-[11px]"
              style={{ background: v['--t-bg'] }}
            >
              <span style={{ color: v['--t-p-user'] }}>$</span>{' '}
              <span style={{ color: v['--t-fg'] }}>ls</span>{' '}
              <span style={{ color: v['--t-accent'] }}>-la</span>
            </span>
            <span
              className={`mt-1 block truncate px-0.5 text-[11px] font-extrabold uppercase ${
                active ? 'text-cotton' : 'text-nylon'
              }`}
            >
              &ldquo;{theme.label}&rdquo;
            </span>
            {active && (
              <span aria-hidden className="ziptag absolute -top-2 -right-1.5 text-[8px]">
                fitted
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
