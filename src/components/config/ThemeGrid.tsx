import { useSettings } from '../../settings/settingsStore'
import { themes } from '../../settings/themes'

/** Display cards: glass preview + silkscreen name, LED on the loaded one. */
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
              className={`block rounded-[4px] px-2.5 py-2.5 font-mono text-[11px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7),inset_0_2px_8px_rgba(0,0,0,0.5)] ${
                active ? 'ring-1 ring-led/70 shadow-[0_0_14px_-4px_var(--w-led)]' : ''
              }`}
              style={{ background: v['--t-bg'] }}
            >
              <span style={{ color: v['--t-p-user'] }}>$</span>{' '}
              <span style={{ color: v['--t-fg'] }}>ls</span>{' '}
              <span style={{ color: v['--t-accent'] }}>-la</span>
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-1.5 px-0.5">
              <span
                className={`silk truncate text-[9px] ${
                  active ? '!text-silk' : 'group-hover:text-silk'
                }`}
              >
                {theme.label}
              </span>
              <span aria-hidden className={`sled shrink-0 ${active ? 'sled-lit' : ''}`} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
