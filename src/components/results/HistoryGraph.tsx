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
        <h3 className="text-[16px] text-ink">
          progress · last {recent.length} tests
        </h3>
        <span className="text-[14px] text-ink">
          best <b className="font-mono">{fmtInt(best)}</b> · latest{' '}
          <b className="font-mono">{fmtInt(last.wpm)}</b> wpm
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
                stroke="var(--w-ink)" strokeOpacity="0.18"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={gy + 3}
                textAnchor="end"
                fontSize="9"
                className="font-mono"
                fill="var(--w-ink)"
              >
                {fmtInt(value)}
              </text>
            </g>
          )
        })}
        <motion.path
          d={smoothPath(pts)}
          fill="none"
          stroke="var(--w-ink)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.2" fill="var(--w-ink)" />
        ))}
      </svg>
    </div>
  )
}
