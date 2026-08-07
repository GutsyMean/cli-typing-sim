import { memo } from 'react'
import type { CharStatus } from '../../engine/typingReducer'

const statusClass: Record<CharStatus, string> = {
  pending: 'text-dim',
  correct: 'text-typed',
  corrected: 'text-typed underline decoration-err/60 decoration-2 underline-offset-4',
  incorrect: 'text-err bg-err-bg rounded-[3px]',
}

export const Char = memo(function Char({
  char,
  status,
}: {
  char: string
  status: CharStatus
}) {
  return (
    <span className={statusClass[status]}>
      {char === ' ' && status === 'incorrect' ? '·' : char}
    </span>
  )
})
