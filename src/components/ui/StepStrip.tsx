/**
 * The sixteen-step row, quartered red / orange / yellow / white.
 * idle: the chase light sweeps on its own clock (the machine keeps time).
 * lit:  a specific step is lit — driven by the player's keystrokes.
 */
const quarterBg = (i: number) =>
  i < 4
    ? 'bg-key-red'
    : i < 8
      ? 'bg-key-orange'
      : i < 12
        ? 'bg-key-yellow'
        : 'bg-key-white'

export function StepStrip({
  lit = null,
  idle = false,
  error = false,
}: {
  /** 0-15 — the step the player's cadence is on */
  lit?: number | null
  /** run the self-clocked idle chase instead */
  idle?: boolean
  /** flash the lit step's LED red-hot (last keystroke was a miss) */
  error?: boolean
}) {
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => {
        const isLit = lit !== null && i === lit
        return (
          <span key={i} className="flex flex-col items-center gap-[3px]">
            <span
              className={`sled !size-[5px] ${isLit || idle ? 'sled-lit' : ''} ${
                isLit && error ? '!bg-key-red !shadow-[0_0_9px_var(--w-key-red)]' : ''
              }`}
              style={
                idle
                  ? {
                      opacity: 0.18,
                      animation: 'chase 1.6s linear infinite',
                      animationDelay: `${i * 0.1}s`,
                    }
                  : undefined
              }
            />
            <span
              className={`h-3.5 w-4 rounded-[2px] sm:w-5 ${quarterBg(i)} ${
                isLit ? '' : 'step-off'
              }`}
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.3)',
              }}
            />
          </span>
        )
      })}
    </div>
  )
}
