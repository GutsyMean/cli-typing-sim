import { motion } from 'motion/react'
import { useHistory } from '../../history/historyStore'
import { fmtInt } from '../../lib/format'
import { niceMax, smoothPath } from './svgChart'

const W = 640
const H = 120
const PAD = { top: 12, right: 12, bottom: 8, left: 34 }

export function HistoryGraph() {
  const entries = useHistory((s) => s.entries)
  if (entries.length < 2) return null

  const recent = entries.slice(-30)
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const yMax = niceMax(Math.max(10, ...recent.map((e) => e.wpm)))

  const pts = recent.map((e, i) => ({
    x: PAD.left + (i / Math.max(1, recent.length - 1)) * innerW,
    y: PAD.top + innerH - (e.wpm / yMax) * innerH,
  }))
  const best = Math.max(...recent.map((e) => e.wpm))
  const last = recent[recent.length - 1]

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between px-1">
        <h3 className="font-sans text-sm font-medium text-ink-soft">
          progress <span className="text-ink-soft">· last {recent.length} tests</span>
        </h3>
        <span className="font-sans text-xs text-ink-soft">
          best <span className="font-mono font-semibold text-safety">{fmtInt(best)}</span> · latest{' '}
          <span className="font-mono font-semibold text-ink">{fmtInt(last.wpm)}</span> wpm
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, yMax / 2, yMax].map((value) => {
          const gy = PAD.top + innerH - (value / yMax) * innerH
          return (
            <g key={value}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={gy}
                y2={gy}
                stroke="var(--w-ink-faint)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={gy + 3}
                textAnchor="end"
                fontSize="9"
                className="font-sans"
                fill="var(--w-ink-soft)"
              >
                {fmtInt(value)}
              </text>
            </g>
          )
        })}
        <motion.path
          d={smoothPath(pts)}
          fill="none"
          stroke="var(--w-safety)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.2" fill="var(--w-safety)" />
        ))}
      </svg>
    </div>
  )
}
