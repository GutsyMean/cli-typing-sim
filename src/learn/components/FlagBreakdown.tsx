import { motion } from 'motion/react'
import { explainFlags } from '../../data/flags'
import type { CategoryId } from '../../data/types'

/** After answering a command question: what every flag in it means. */
export function FlagBreakdown({
  text,
  category,
}: {
  text: string
  category: CategoryId
}) {
  const explained = explainFlags(text, category)
  if (explained.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-3 flex flex-col gap-1 rounded-lg border border-edge bg-surface/60 px-3 py-2.5"
    >
      <div className="font-sans text-[10px] font-semibold tracking-[0.14em] text-faint uppercase select-none">
        flag breakdown
      </div>
      {explained.map((f) => (
        <div key={f.flag} className="flex items-baseline gap-3">
          <span className="w-24 shrink-0 font-mono text-[13px] font-semibold text-accent">
            {f.flag}
          </span>
          <span className="font-sans text-[13px] text-dim">{f.desc}</span>
        </div>
      ))}
    </motion.div>
  )
}
