import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/** Each theme is a tiny monitor set into the panel showing a live sample. */
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
            className={`p-1.5 text-left ${active ? 'key-down' : 'key-up'}`}
          >
            <span
              className="block px-2.5 py-2 font-mono text-[11px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.55)]"
              style={{ background: v['--t-bg'] }}
            >
              <span style={{ color: v['--t-p-user'] }}>$</span>{' '}
              <span style={{ color: v['--t-fg'] }}>ls</span>{' '}
              <span style={{ color: v['--t-accent'] }}>-la</span>
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-1.5 px-0.5">
              <span
                className={`truncate font-sans text-[11px] font-medium ${
                  active ? 'text-teal-deep' : 'text-ink-soft'
                }`}
              >
                {theme.label}
              </span>
              <span aria-hidden className={`led shrink-0 ${active ? 'led-on' : ''}`} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
