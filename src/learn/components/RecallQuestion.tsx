import { Char } from '../../components/terminal/Char'
import type { LearnPhase } from '../learnReducer'
import type { Question } from '../questions'
import type { PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import { InputLine } from './InputLine'

export function RecallQuestion({
  question,
  input,
  phase,
  promptSetting,
  caretStyle,
}: {
  question: Question
  input: string
  phase: LearnPhase
  promptSetting: 'auto' | PromptId
  caretStyle: CaretStyle
}) {
  const { entry } = question
  const feedback = phase.name === 'feedback' ? phase : null
  const diff = phase.name === 'recall-diff' ? phase : null

  return (
    <div data-qtype="recall" data-answer={entry.text} className="flex flex-col gap-1.5">
      <div className="terminal-text text-dim select-none"># {entry.desc}</div>

      {!feedback && !diff && (
        <InputLine
          value={input}
          promptSetting={promptSetting}
          category={entry.category}
          caretStyle={caretStyle}
        />
      )}

      {feedback?.correct && (
        <div className="terminal-text whitespace-pre-wrap break-words">
          <span className="text-accent">{entry.text}</span>
          <span className="ml-3 select-none font-sans text-xs text-accent">✓ from memory</span>
        </div>
      )}

      {diff && (
        <div className="flex flex-col gap-0.5">
          <div className="terminal-text whitespace-pre-wrap break-words">
            <span className="mr-3 select-none font-sans text-xs text-faint">you typed</span>
            <span className="text-err/90">{diff.typed || '∅'}</span>
          </div>
          <div className="terminal-text whitespace-pre-wrap break-words">
            <span className="mr-3 select-none font-sans text-xs text-faint">expected</span>
            {[...entry.text].map((ch, i) => (
              <Char key={i} char={ch} status={diff.diff.statuses[i]} />
            ))}
            {diff.diff.extra && (
              <span className="text-err/80 bg-err-bg rounded-[3px]">{diff.diff.extra}</span>
            )}
          </div>
          <div className="mt-1 font-sans text-xs text-faint select-none">
            press any key, then type the command once to lock it in
          </div>
        </div>
      )}
    </div>
  )
}
