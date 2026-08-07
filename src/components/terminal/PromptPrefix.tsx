import { memo } from 'react'
import type { PromptStyle } from '../../settings/prompts'

const colorClass = {
  user: 'text-p-user',
  path: 'text-p-path',
  sym: 'text-p-sym',
} as const

export const PromptPrefix = memo(function PromptPrefix({
  prompt,
}: {
  prompt: PromptStyle
}) {
  return (
    <span className="select-none whitespace-pre font-semibold">
      {prompt.segments.map((seg, i) => (
        <span key={i} className={colorClass[seg.color]}>
          {seg.text}
        </span>
      ))}
    </span>
  )
})
