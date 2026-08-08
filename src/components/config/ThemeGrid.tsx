import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/**
 * Display-mode swatches, printed like ink chips in a catalog: each cell
 * shows the terminal theme's actual colors inside an ink keyline.
 */
export function ThemeGrid() {
  const current = useSettings((s) => s.theme)
  const set = useSettings((s) => s.set)

  return (
    <div className="grid grid-cols-2 border-t border-l border-ink sm:grid-cols-4">
      {themes.map((theme) => {
        const active = theme.id === current
        const v = theme.vars
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => set('theme', theme.id)}
            className={`group border-r border-b border-ink p-2 text-left transition-colors duration-100 ${
              active ? 'bg-paper-hi' : 'hover:bg-ink/5'
            }`}
          >
            <span
              className="flex h-12 items-center gap-2 border border-ink/60 px-3"
              style={{ background: v['--t-bg'] }}
            >
              <span className="font-mono text-[12px] font-semibold" style={{ color: v['--t-p-user'] }}>
                $
              </span>
              <span className="font-mono text-[12px]" style={{ color: v['--t-fg'] }}>
                ls -la
              </span>
              <span
                className="ml-auto inline-block h-4 w-[7px]"
                style={{ background: v['--t-accent'] }}
              />
            </span>
            <span className="mt-1.5 flex items-center justify-between">
              <span
                className={`font-sans text-[12px] font-semibold uppercase tracking-wide ${
                  active ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                }`}
              >
                {theme.label}
              </span>
              {active && (
                <span className="bg-safety px-1.5 font-sans text-[10px] font-bold text-paper-hi uppercase">
                  fitted
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
