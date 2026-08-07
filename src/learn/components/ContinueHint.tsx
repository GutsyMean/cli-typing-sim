import { motion } from 'motion/react'

/** Sticky-feedback affordance: click or press any key to move on. */
export function ContinueHint({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.button
      type="button"
      data-continue
      onClick={onContinue}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      whileHover={{ y: -1 }}
      className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-edge bg-surface px-3 py-1.5 font-sans text-[13px] text-dim hover:border-faint hover:text-fg"
    >
      continue <span className="text-faint">— or press any key</span>
      <span aria-hidden className="text-accent">→</span>
    </motion.button>
  )
}
