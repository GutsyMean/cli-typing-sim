import { memo } from 'react'
import type { LineState } from '../../engine/typingReducer'
import { categoryPrompt, promptById, type PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import { Caret } from './Caret'
import { Char } from './Char'
import { PromptPrefix } from './PromptPrefix'

interface CommandLineProps {
  line: LineState
  state: 'done' | 'active' | 'upcoming'
  promptSetting: 'auto' | PromptId
  caretStyle: CaretStyle
  caretBlink: boolean
  showCaret: boolean
  showDesc: boolean
}

export const CommandLine = memo(function CommandLine({
  line,
  state,
  promptSetting,
  caretStyle,
  caretBlink,
  showCaret,
  showDesc,
}: CommandLineProps) {
  const promptId =
    promptSetting === 'auto' ? categoryPrompt[line.entry.category] : promptSetting
  const prompt = promptById(promptId)
  const { entry, typed, cursor, extra } = line
  const active = state === 'active'

  return (
    <div
      data-line={state}
      data-cmd={entry.text}
      className={
        state === 'done'
          ? 'opacity-45 transition-opacity duration-300'
          : state === 'upcoming'
            ? 'opacity-35'
            : ''
      }
    >
      <div className="terminal-text whitespace-pre-wrap break-words">
        <PromptPrefix prompt={prompt} />
        {[...entry.text].map((char, i) => (
          <span key={i} className="relative">
            {active && showCaret && i === cursor && extra.length === 0 && (
              <Caret style={caretStyle} blink={caretBlink} />
            )}
            <Char char={char} status={typed[i]} />
          </span>
        ))}
        {extra.length > 0 && (
          <span className="relative text-err/80 bg-err-bg rounded-[3px]">
            {extra}
            {active && showCaret && (
              <Caret style={caretStyle} blink={caretBlink} />
            )}
          </span>
        )}
        {active && showCaret && cursor >= entry.text.length && extra.length === 0 && (
          <span className="relative">
            <Caret style={caretStyle} blink={caretBlink} />
            <span className="text-faint">&nbsp;</span>
          </span>
        )}
      </div>
      {showDesc && active && (
        <div className="terminal-text !text-[0.72em] text-faint select-none -mt-1">
          <span className="whitespace-pre"># {entry.desc}</span>
        </div>
      )}
    </div>
  )
})
