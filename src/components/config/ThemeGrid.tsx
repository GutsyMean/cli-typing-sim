import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/** Each display is a small gate screen; the boarding one gets the yellow band. */
export function ThemeGrid() {
  const current = useSettings((s) => s.theme)
  const set = useSettings((s) => s.set)

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {themes.map((theme) => {
        const active = theme.id === current
        const v = theme.vars
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={active}
            onClick={() => set('theme', theme.id)}
            className={`text-left ${
              active ? '' : 'opacity-90 hover:opacity-100'
            }`}
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
              className={`flex items-center justify-between px-2 py-1 text-[12px] font-bold ${
                active ? 'bg-sign text-signink' : 'bg-panel text-board-soft'
              }`}
            >
              <span className="truncate">{theme.label}</span>
              {active && <span aria-hidden>→</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
