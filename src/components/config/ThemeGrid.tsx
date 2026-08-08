import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/**
 * The monitors window: each theme is a small color screen on the one-bit
 * desktop — the chosen one wears marching ants.
 */
export function ThemeGrid() {
  const current = useSettings((s) => s.theme)
  const set = useSettings((s) => s.set)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-1 sm:grid-cols-4">
      {themes.map((theme) => {
        const active = theme.id === current
        const v = theme.vars
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={active}
            onClick={() => set('theme', theme.id)}
            className={`group text-left ${active ? 'ants' : ''}`}
          >
            <span
              className="block border-2 border-ink px-2.5 py-2 font-mono text-[14px]"
              style={{ background: v['--t-bg'] }}
            >
              <span style={{ color: v['--t-p-user'] }}>$</span>{' '}
              <span style={{ color: v['--t-fg'] }}>ls</span>{' '}
              <span style={{ color: v['--t-accent'] }}>-la</span>
            </span>
            <span
              className={`mt-1 block truncate text-center text-[14px] text-ink ${
                active ? 'font-bold' : 'group-hover:underline'
              }`}
            >
              {theme.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
