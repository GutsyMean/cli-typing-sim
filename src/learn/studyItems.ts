import type { FlagEntry } from '../data/flags'
import type { CategoryId, CommandEntry } from '../data/types'
import type { LearnScope } from '../settings/settingsStore'
import { commandKey } from './learnStore'

export type StudyItem =
  | { kind: 'command'; entry: CommandEntry }
  | { kind: 'flag'; flag: FlagEntry }

export const flagKey = (f: Pick<FlagEntry, 'category' | 'tool' | 'flag'>): string =>
  `flag:${f.category}:${f.tool}:${f.flag}`

export const studyKey = (item: StudyItem): string =>
  item.kind === 'command' ? commandKey(item.entry) : flagKey(item.flag)

export const itemCategory = (item: StudyItem): CategoryId =>
  item.kind === 'command' ? item.entry.category : item.flag.category

/** short display label: the command text or `tool -flag` */
export const itemLabel = (item: StudyItem): string =>
  item.kind === 'command' ? item.entry.text : `${item.flag.tool} ${item.flag.flag}`

export const itemDesc = (item: StudyItem): string =>
  item.kind === 'command' ? item.entry.desc : item.flag.desc

export function buildStudyItems(
  commands: CommandEntry[],
  flags: FlagEntry[],
  scope: LearnScope,
): StudyItem[] {
  const items: StudyItem[] = []
  if (scope !== 'flags') {
    for (const entry of commands) items.push({ kind: 'command', entry })
  }
  if (scope !== 'commands') {
    for (const flag of flags) items.push({ kind: 'flag', flag })
  }
  return items
}
