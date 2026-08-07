import { motion } from 'motion/react'
import type { CaretStyle } from '../../settings/settingsStore'

const styleClass: Record<CaretStyle, string> = {
  block: 'inset-y-[0.28em] -inset-x-px rounded-[3px] bg-accent/80',
  line: 'inset-y-[0.28em] -left-px w-[2.5px] rounded-full bg-accent',
  underscore: 'bottom-[0.22em] inset-x-0 h-[2.5px] rounded-full bg-accent',
}

/**
 * Rendered inside the current char's wrapper span; layoutId lets Motion
 * spring it between positions (and across lines) as the cursor moves.
 */
export function Caret({ style, blink }: { style: CaretStyle; blink: boolean }) {
  return (
    <motion.span
      layoutId="caret"
      transition={{ type: 'spring', stiffness: 1100, damping: 70 }}
      className={`absolute z-10 ${styleClass[style]} ${blink ? 'caret-blink' : ''} ${
        style === 'block' ? 'mix-blend-difference' : ''
      }`}
      aria-hidden
    />
  )
}
