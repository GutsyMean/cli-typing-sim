import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/** CRT phosphor options: small tube previews; the fitted one's placard lights. */
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
            className="group text-left"
          >
            <span
              className={`block rounded-sm px-2.5 py-2.5 font-mono text-[11px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7),inset_0_2px_8px_rgba(0,0,0,0.5)] ${
                active
                  ? 'ring-1 ring-lamp/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7),0_0_16px_-4px_var(--w-lamp)]'
                  : ''
              }`}
              style={{ background: v['--t-bg'] }}
            >
              <span style={{ color: v['--t-p-user'] }}>$</span>{' '}
              <span style={{ color: v['--t-fg'] }}>ls</span>{' '}
              <span style={{ color: v['--t-accent'] }}>-la</span>
            </span>
            <span
              className={`lens mt-1.5 block truncate px-2 py-1 text-center text-[10px] tracking-[0.1em] uppercase ${
                active ? 'lens-lit' : 'group-hover:text-legend'
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
