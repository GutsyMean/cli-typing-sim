import { promptStyles } from '../../settings/prompts'
import { useSettings } from '../../settings/settingsStore'
import { Segment } from '../ui/Segment'
import { Toggle } from '../ui/Toggle'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[16px] text-ink">{label}</span>
      {children}
    </div>
  )
}

export function OptionsPanel() {
  const s = useSettings()

  return (
    <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Row label="prompt">
          <select
            value={s.promptStyle}
            onChange={(e) => s.set('promptStyle', e.target.value as typeof s.promptStyle)}
            className="border-2 border-ink bg-paper px-2.5 py-1 font-mono text-[16px] text-ink shadow-[1px_1px_0_var(--w-ink)] outline-none"
          >
            <option value="auto">auto (match category)</option>
            {promptStyles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Row>
        <Row label="caret">
          <Segment
            groupId="caret"
            options={[
              { value: 'block', label: '█' },
              { value: 'line', label: '|' },
              { value: 'underscore', label: '_' },
            ]}
            value={s.caretStyle}
            onChange={(v) => s.set('caretStyle', v)}
          />
        </Row>
        <Row label="font size">
          <Segment
            groupId="fontsize"
            options={[
              { value: 'sm', label: 'sm' },
              { value: 'md', label: 'md' },
              { value: 'lg', label: 'lg' },
              { value: 'xl', label: 'xl' },
            ]}
            value={s.fontSize}
            onChange={(v) => s.set('fontSize', v)}
          />
        </Row>
      </div>

      <div className="flex flex-col gap-1">
        <Toggle checked={s.caretBlink} onChange={(v) => s.set('caretBlink', v)} label="caret blink" />
        <Toggle checked={s.showLiveStats} onChange={(v) => s.set('showLiveStats', v)} label="live wpm & timer" />
        <Toggle
          checked={s.showDescriptions}
          onChange={(v) => s.set('showDescriptions', v)}
          label="show command explanations"
        />
        <Toggle checked={s.soundEnabled} onChange={(v) => s.set('soundEnabled', v)} label="keypress sound" />
        <Toggle
          checked={s.errorSoundEnabled}
          onChange={(v) => s.set('errorSoundEnabled', v)}
          label="error sound"
        />
      </div>
    </div>
  )
}
