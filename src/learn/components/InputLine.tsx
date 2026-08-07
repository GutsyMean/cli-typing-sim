import { PromptPrefix } from '../../components/terminal/PromptPrefix'
import { Caret } from '../../components/terminal/Caret'
import type { PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import type { CategoryId } from '../../data/types'
import { promptFor } from '../promptFor'

export function InputLine({
  value,
  promptSetting,
  category,
  caretStyle,
  active = true,
}: {
  value: string
  promptSetting: 'auto' | PromptId
  category: CategoryId
  caretStyle: CaretStyle
  active?: boolean
}) {
  return (
    <div className="terminal-text whitespace-pre-wrap break-words">
      <PromptPrefix prompt={promptFor(promptSetting, category)} />
      <span className="text-typed">{value}</span>
      {active && (
        <span className="relative">
          <Caret style={caretStyle} blink={value.length === 0} layoutId="caret-input" />
          <span className="text-faint">&nbsp;</span>
        </span>
      )}
    </div>
  )
}
