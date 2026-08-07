import type { CategoryId, Difficulty } from '../types'

export interface FlagEntry {
  /**
   * The tool the flag belongs to — a single word (`ls`, `rsync`) or a
   * compound with its subcommand (`git commit`, `docker run`) when the
   * flag's meaning is subcommand-specific.
   */
  tool: string
  /** The flag exactly as typed, without any =value part: `-la`, `--amend`, `/s` */
  flag: string
  /** lowercase one-liner: what the flag does for that tool */
  desc: string
  category: CategoryId
  difficulty: Difficulty
}
