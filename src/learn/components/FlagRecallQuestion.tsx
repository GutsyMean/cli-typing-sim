import type { LearnPhase } from '../learnReducer'
import type { Question } from '../questions'
import type { PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import { itemCategory } from '../studyItems'
import { ContinueHint } from './ContinueHint'
import { InputLine } from './InputLine'

/** Level-2 flag question: given the tool + meaning, type the flag. */
export function FlagRecallQuestion({
  question,
  input,
  phase,
  promptSetting,
  caretStyle,
  onContinue,
}: {
  question: Question
  input: string
  phase: LearnPhase
  promptSetting: 'auto' | PromptId
  caretStyle: CaretStyle
  onContinue: () => void
}) {
  const feedback = phase.name === 'feedback' ? phase : null

  return (
    <div data-qtype="flag-recall" className="flex flex-col gap-1.5">
      <div className="terminal-text text-dim select-none"># {question.comment}</div>
      {!feedback && (
        <InputLine
          value={input}
          promptSetting={promptSetting}
          category={itemCategory(question.item)}
          caretStyle={caretStyle}
        />
      )}
      {feedback &&
        (feedback.correct ? (
          <div className="terminal-text">
            <span className="text-accent font-semibold">{question.answer}</span>
            <span className="ml-3 select-none font-sans text-xs text-accent">✓</span>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1">
            <div className="font-sans text-sm text-err select-none">
              the flag is <span className="font-mono font-semibold">{question.answer}</span>
              {feedback.typed && (
                <span className="text-dim">
                  {' '}
                  — you typed <span className="font-mono">{feedback.typed}</span>
                </span>
              )}
            </div>
            <ContinueHint onContinue={onContinue} />
          </div>
        ))}
    </div>
  )
}
