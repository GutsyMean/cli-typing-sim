import { motion } from 'motion/react'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left"
    >
      <span className="font-sans text-[13px] text-dim transition-colors group-hover:text-fg">
        {label}
      </span>
      <span
        className={`flex h-5 w-9 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-200 ${
          checked ? 'justify-end border-transparent bg-accent/90' : 'justify-start border-edge bg-raised'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 40 }}
          className={`size-4 rounded-full ${checked ? 'bg-term' : 'bg-dim'}`}
        />
      </span>
    </button>
  )
}
