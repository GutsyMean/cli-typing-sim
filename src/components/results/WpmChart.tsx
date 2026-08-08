import { motion } from 'motion/react'
import { useState } from 'react'
import type { SecondBin } from '../../engine/metrics'
import { fmtInt } from '../../lib/format'
import { niceMax, smoothPath } from './svgChart'

const W = 640
const H = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 40 }

export function WpmChart({ bins }: { bins: SecondBin[] }) {
  const [hover, setHover] = useState<number | null>(null)

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const yMax = niceMax(Math.max(10, ...bins.map((b) => Math.max(b.raw, b.smooth))))

  const x = (sec: number) =>
    PAD.left + ((sec - 1) / Math.max(1, bins.length - 1)) * innerW
  const y = (wpm: number) => PAD.top + innerH - (wpm / yMax) * innerH

  const smoothPts = bins.map((b) => ({ x: x(b.sec), y: y(b.smooth) }))
  const rawPts = bins.map((b) => ({ x: x(b.sec), y: y(b.raw) }))
  const gridLines = 4
  const xTickEvery = Math.max(1, Math.ceil(bins.length / 8))

  const hovered = hover !== null ? bins[hover] : null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - rect.left) / rect.width) * W
          const frac = (px - PAD.left) / innerW
          const i = Math.round(frac * (bins.length - 1))
          setHover(i >= 0 && i < bins.length ? i : null)
        }}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const value = (yMax / gridLines) * i
          const gy = y(value)
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={gy}
                y2={gy}
                stroke="var(--w-seam)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={gy + 3}
                textAnchor="end"
                className="font-sans"
                fontSize="10"
                fill="var(--w-nylon-soft)"
              >
                {fmtInt(value)}
              </text>
            </g>
          )
        })}
        {bins.map((b) =>
          (b.sec - 1) % xTickEvery === 0 || b.sec === bins.length ? (
            <text
              key={b.sec}
              x={x(b.sec)}
              y={H - 8}
              textAnchor="middle"
              className="font-sans"
              fontSize="10"
              fill="var(--w-nylon-soft)"
            >
              {b.sec}
            </text>
          ) : null,
        )}

        {/* raw wpm ghost */}
        <motion.path
          d={smoothPath(rawPts)}
          fill="none"
          stroke="var(--w-nylon-soft)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        {/* smoothed wpm line */}
        <motion.path
          d={smoothPath(smoothPts)}
          fill="none"
          stroke="var(--w-nylon)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        {/* error markers */}
        {bins
          .filter((b) => b.errors > 0)
          .map((b) => (
            <motion.g
              key={b.sec}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <circle cx={x(b.sec)} cy={y(b.raw)} r="3.5" fill="var(--w-tag)" />
            </motion.g>
          ))}

        {hovered && (
          <line
            x1={x(hovered.sec)}
            x2={x(hovered.sec)}
            y1={PAD.top}
            y2={PAD.top + innerH}
            stroke="var(--w-nylon-soft)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 bg-nylon px-3 py-1.5 text-xs text-cotton"
          style={{
            left: `${(x(hovered.sec) / W) * 100}%`,
            top: 0,
          }}
        >
          <span className="opacity-75">{hovered.sec}s · </span>
          <span className="font-bold">{fmtInt(hovered.smooth)} wpm</span>
          {hovered.errors > 0 && (
            <span className="text-tag"> · {hovered.errors} err</span>
          )}
        </div>
      )}

      <div className="mt-1 flex justify-center gap-5 text-[11px] font-semibold text-nylon-soft uppercase">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 bg-nylon" /> wpm
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[2px] w-4 bg-nylon-soft" /> raw
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-tag" /> errors
        </span>
      </div>
    </div>
  )
}
