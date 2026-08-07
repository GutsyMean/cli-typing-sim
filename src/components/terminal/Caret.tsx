import { motion } from 'motion/react'
import type { CaretStyle } from '../../settings/settingsStore'

/*
 * The caret is absolutely positioned inside an inline char wrapper, so its
 * containing block is the char's 1em content box — size it in em units from
 * the top edge (no CSS transforms: the layoutId FLIP animation owns transform).
 */
const styleClass: Record<CaretStyle, string> = {
  block: 'top-[-0.15em] h-[1.3em] -inset-x-px rounded-[3px] bg-accent/80',
  line: 'top-[-0.15em] h-[1.3em] -left-[1.5px] w-[2.5px] rounded-full bg-accent',
  underscore: 'top-[1.05em] h-[2.5px] inset-x-0 rounded-full bg-accent',
}

/**
 * Rendered inside the current char's wrapper span; layoutId lets Motion
 * spring it between positions (and across lines) as the cursor moves.
 */
export function Caret({
  style,
  blink,
  layoutId = 'caret',
}: {
  style: CaretStyle
  blink: boolean
  layoutId?: string
}) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 1100, damping: 70 }}
      className={`absolute z-10 ${styleClass[style]} ${blink ? 'caret-blink' : ''} ${
        style === 'block' ? 'mix-blend-difference' : ''
      }`}
      aria-hidden
    />
  )
}
