export const fmtInt = (n: number): string => String(Math.round(n))

export const fmt1 = (n: number): string =>
  (Math.round(n * 10) / 10).toFixed(1)

export const fmtPercent = (n: number): string => `${fmt1(n)}%`

export const fmtClock = (totalSeconds: number): string => {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export const fmtDate = (ts: number): string =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
