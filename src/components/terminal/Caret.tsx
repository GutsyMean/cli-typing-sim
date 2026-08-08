import type { CaretStyle } from '../../settings/settingsStore'

/*
 * The caret is absolutely positioned inside an inline char wrapper, so its
 * containing block is the char's 1em content box — size it in em units from
 * the top edge. Pure CSS positioning, no animated transforms: a layout
 * projection here holds stale offsets on iOS when the self-hosted mono
 * swaps in and the line reflows, drifting the caret off its glyph.
 */
const styleClass: Record<CaretStyle, string> = {
  block: 'top-[0.13em] h-[1.3em] -inset-x-px rounded-[3px] bg-accent/80',
  line: 'top-[0.13em] h-[1.3em] -left-[1.5px] w-[2.5px] rounded-full bg-accent',
  underscore: 'top-[1.05em] h-[2.5px] inset-x-0 rounded-full bg-accent',
}

/** Rendered inside the current char's wrapper span. */
export function Caret({
  style,
  blink,
}: {
  style: CaretStyle
  blink: boolean
  /** retained for call-site compatibility; the caret no longer animates between chars */
  layoutId?: string
}) {
  return (
    <span
      className={`absolute z-10 ${styleClass[style]} ${blink ? 'caret-blink' : ''} ${
        style === 'block' ? 'mix-blend-difference' : ''
      }`}
      aria-hidden
    />
  )
}
