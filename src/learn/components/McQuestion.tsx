import { motion } from 'motion/react'
import type { LearnPhase } from '../learnReducer'
import type { Question } from '../questions'
import { ContinueHint } from './ContinueHint'

export function McQuestion({
  question,
  phase,
  onChoose,
  onContinue,
}: {
  question: Question
  phase: LearnPhase
  onChoose: (index: number) => void
  onContinue: () => void
}) {
  const feedback = phase.name === 'feedback' ? phase : null

  return (
    <div data-qtype="mc" className="flex flex-col gap-1.5">
      <div className="terminal-text text-dim select-none"># {question.entry.desc}</div>
      <div className="mt-1 flex flex-col gap-1">
        {question.options!.map((opt, i) => {
          const isCorrect = i === question.correctIndex
          const isChosen = feedback?.chosenIndex === i
          let cls = 'text-fg hover:text-typed'
          if (feedback) {
            cls = isCorrect
              ? 'text-accent'
              : isChosen
                ? 'text-err bg-err-bg rounded-md'
                : 'text-faint'
          }
          return (
            <motion.button
              key={`${opt.text}-${i}`}
              type="button"
              data-option={i}
              data-correct={isCorrect}
              onClick={() => onChoose(i)}
              disabled={!!feedback}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`terminal-text flex items-baseline gap-3 px-1 py-0.5 text-left transition-colors duration-150 ${cls}`}
            >
              <span className="select-none font-semibold text-dim">[{i + 1}]</span>
              <span className="whitespace-pre-wrap break-words">{opt.text}</span>
              {feedback && isCorrect && (
                <span className="select-none font-sans text-xs text-accent">✓</span>
              )}
            </motion.button>
          )
        })}
      </div>
      {feedback ? (
        feedback.correct ? (
          <div className="mt-1 font-sans text-sm font-semibold text-accent select-none">
            correct ✓
          </div>
        ) : (
          <ContinueHint onContinue={onContinue} />
        )
      ) : (
        <div className="mt-1 font-sans text-xs text-faint select-none">
          press 1–{question.options!.length} to answer
        </div>
      )}
    </div>
  )
}
