import { AnimatePresence, motion } from 'motion/react'
import { PromptPrefix } from '../../components/terminal/PromptPrefix'
import type { PromptId } from '../../settings/prompts'
import type { ScrollbackItem } from '../learnReducer'
import { promptFor } from '../promptFor'

export function Scrollback({
  items,
  promptSetting,
}: {
  items: ScrollbackItem[]
  promptSetting: 'auto' | PromptId
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 45 }}
            className="terminal-text !text-[0.85em] whitespace-pre-wrap break-words opacity-45"
          >
            <PromptPrefix prompt={promptFor(promptSetting, item.category)} />
            <span className="text-typed">{item.label}</span>
            <span
              className={`ml-2 select-none font-sans text-xs ${
                item.correct ? 'text-accent' : 'text-err'
              }`}
            >
              {item.correct ? '✓' : '✗'}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
