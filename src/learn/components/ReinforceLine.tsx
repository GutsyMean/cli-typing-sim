import { CommandLine } from '../../components/terminal/CommandLine'
import type { LineState } from '../../engine/typingReducer'
import type { PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import type { ReinforceState } from '../learnReducer'

/** Adapts the reinforce sub-state into a LineState so CommandLine renders it. */
export function ReinforceLine({
  reinforce,
  promptSetting,
  caretStyle,
}: {
  reinforce: ReinforceState
  promptSetting: 'auto' | PromptId
  caretStyle: CaretStyle
}) {
  const line: LineState = {
    entry: reinforce.entry,
    typed: reinforce.typed,
    wrongOnce: reinforce.wrongOnce,
    cursor: reinforce.cursor,
    extra: '',
    completed: false,
  }
  return (
    <div data-reinforce data-answer={reinforce.entry.text} className="flex flex-col gap-1.5">
      <div className="font-sans text-xs text-faint select-none">
        type it once, then enter:
      </div>
      <CommandLine
        line={line}
        state="active"
        promptSetting={promptSetting}
        caretStyle={caretStyle}
        caretBlink={false}
        showCaret
        showDesc={false}
      />
    </div>
  )
}
