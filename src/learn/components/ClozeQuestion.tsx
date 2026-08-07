import type { LearnPhase } from '../learnReducer'
import type { Question } from '../questions'
import type { PromptId } from '../../settings/prompts'
import type { CaretStyle } from '../../settings/settingsStore'
import { ContinueHint } from './ContinueHint'
import { InputLine } from './InputLine'

export function ClozeQuestion({
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
  const entry = question.item.kind === 'command' ? question.item.entry : null
  const mask = question.mask!
  if (!entry) return null
  const before = entry.text.slice(0, mask.start)
  const after = entry.text.slice(mask.start + mask.length)
  const feedback = phase.name === 'feedback' ? phase : null

  return (
    <div data-qtype="cloze" className="flex flex-col gap-1.5">
      <div className="terminal-text text-dim select-none"># {question.comment}</div>
      <div className="terminal-text whitespace-pre-wrap break-words select-none">
        <span className="text-fg">{before}</span>
        {feedback ? (
          <span className={feedback.correct ? 'text-accent font-semibold' : 'text-err font-semibold'}>
            {mask.token}
          </span>
        ) : (
          <span className="text-accent">{'_'.repeat(mask.length)}</span>
        )}
        <span className="text-fg">{after}</span>
      </div>
      {!feedback && (
        <div className="mt-1">
          <div className="mb-1 font-sans text-xs text-faint select-none">
            type the missing part:
          </div>
          <InputLine
            value={input}
            promptSetting={promptSetting}
            category={entry.category}
            caretStyle={caretStyle}
          />
        </div>
      )}
      {feedback &&
        (feedback.correct ? (
          <div className="font-sans text-sm font-semibold text-accent select-none">
            correct ✓
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1">
            <div className="font-sans text-sm text-err select-none">
              the answer was <span className="font-mono font-semibold">{mask.token}</span>
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
