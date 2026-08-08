import { useState } from 'react'
import { allCommands, categoryLabel, categories as allCategories } from '../../data/commands'
import { allFlags } from '../../data/flags'
import { filterPool } from '../../data/generator'
import type { CategoryId } from '../../data/types'
import { useSettings } from '../../settings/settingsStore'
import { useLearn, type MasteryRecord } from '../learnStore'
import { buildStudyItems, itemDesc, itemLabel, studyKey, type StudyItem } from '../studyItems'

interface CategoryProgress {
  id: CategoryId
  mastered: number
  learning: number
  total: number
}

function Bar({ mastered, learning, total }: { mastered: number; learning: number; total: number }) {
  const m = total === 0 ? 0 : (mastered / total) * 100
  const l = total === 0 ? 0 : (learning / total) * 100
  return (
    <span className="tempo flex h-3 flex-1 overflow-hidden p-px shadow-none">
      <span className="h-full bg-tempo" style={{ width: `${m}%` }} />
      <span className="h-full bg-tempo/35" style={{ width: `${l}%` }} />
    </span>
  )
}

function ItemRow({ item, note, noteClass }: { item: StudyItem; note: string; noteClass: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-[4px] border border-deck-edge bg-chassis px-3 py-2">
      <div className="min-w-0">
        <div className="truncate font-mono text-sm font-bold text-silk">
          {itemLabel(item)}
          {item.kind === 'flag' && (
            <span className="silk ml-2 text-[8px]">flag</span>
          )}
        </div>
        <div className="truncate font-sans text-xs text-silk-dim">{itemDesc(item)}</div>
      </div>
      <span className={`shrink-0 font-sans text-xs font-bold ${noteClass}`}>{note}</span>
    </div>
  )
}

export function LearnOverview() {
  const records = useLearn((s) => s.records)
  const reset = useLearn((s) => s.reset)
  const selectedCategories = useSettings((s) => s.categories)
  const difficulties = useSettings((s) => s.difficulties)
  const scope = useSettings((s) => s.learnScope)
  const [resetArmed, setResetArmed] = useState(false)

  const commandPool = filterPool(allCommands, selectedCategories, difficulties)
  const cats = new Set(selectedCategories)
  const diffs = new Set(difficulties)
  const flagPool = allFlags.filter((f) => cats.has(f.category) && diffs.has(f.difficulty))
  const items = buildStudyItems(commandPool, flagPool, scope)

  const level = (item: StudyItem) => records[studyKey(item)]?.level ?? 0
  const mastered = items.filter((i) => level(i) === 3)
  const learning = items.filter((i) => level(i) > 0 && level(i) < 3)

  const byCategory: CategoryProgress[] = allCategories
    .filter((c) => selectedCategories.includes(c.id))
    .map((c) => {
      const inCat = items.filter(
        (i) => (i.kind === 'command' ? i.entry.category : i.flag.category) === c.id,
      )
      return {
        id: c.id,
        mastered: inCat.filter((i) => level(i) === 3).length,
        learning: inCat.filter((i) => level(i) > 0 && level(i) < 3).length,
        total: inCat.length,
      }
    })

  const withRecord = (i: StudyItem): [StudyItem, MasteryRecord] | null => {
    const r = records[studyKey(i)]
    return r ? [i, r] : null
  }
  const recentlyMastered = mastered
    .map(withRecord)
    .filter((x): x is [StudyItem, MasteryRecord] => x !== null)
    .sort((a, b) => b[1].lastSeen - a[1].lastSeen)
    .slice(0, 5)
  const needsWork = items
    .map(withRecord)
    .filter((x): x is [StudyItem, MasteryRecord] => x !== null)
    .filter(([i, r]) => r.misses > 0 && level(i) < 3)
    .sort((a, b) => b[1].misses - a[1].misses)
    .slice(0, 5)

  const anyProgress = Object.keys(records).length > 0

  if (!anyProgress) {
    return (
      <p className="rounded-[4px] border border-dashed border-deck-edge px-4 py-6 text-center font-sans text-[13px] text-silk-dim">
        nothing learned yet — hit start learning and your mastery progress will build here.
      </p>
    )
  }

  const commandCount = items.filter((i) => i.kind === 'command').length
  const flagCount = items.length - commandCount

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <span className="font-sans text-sm text-silk-dim">
            <span className="font-mono font-bold text-tempo">{mastered.length}</span>
            <span> / {items.length}</span> mastered in your selection
            <span>
              {' '}
              ({commandCount > 0 && `${commandCount} commands`}
              {commandCount > 0 && flagCount > 0 && ' · '}
              {flagCount > 0 && `${flagCount} flags`})
            </span>
            {learning.length > 0 && (
              <span> · {learning.length} in progress</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              if (resetArmed) {
                reset()
                setResetArmed(false)
              } else {
                setResetArmed(true)
              }
            }}
            onBlur={() => setResetArmed(false)}
            className={`font-sans text-xs transition-colors ${
              resetArmed ? 'font-bold text-key-red' : 'text-silk-dim underline hover:text-silk'
            }`}
          >
            {resetArmed ? 'click again to wipe all progress' : 'reset progress'}
          </button>
        </div>
        <Bar mastered={mastered.length} learning={learning.length} total={items.length} />
      </div>

      <div className="flex flex-col gap-2">
        {byCategory.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 font-mono text-xs text-silk">{categoryLabel(c.id)}</span>
            <Bar mastered={c.mastered} learning={c.learning} total={c.total} />
            <span className="w-16 text-right font-sans text-xs text-silk-dim tabular-nums">
              {c.mastered}/{c.total}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {recentlyMastered.length > 0 && (
          <div>
            <h3 className="silk mb-2 text-[9px]">recently mastered</h3>
            <div className="flex flex-col gap-2">
              {recentlyMastered.map(([i]) => (
                <ItemRow key={studyKey(i)} item={i} note="✓" noteClass="text-silk" />
              ))}
            </div>
          </div>
        )}
        {needsWork.length > 0 && (
          <div>
            <h3 className="silk mb-2 text-[9px]">needs work</h3>
            <div className="flex flex-col gap-2">
              {needsWork.map(([i, r]) => (
                <ItemRow
                  key={studyKey(i)}
                  item={i}
                  note={`×${r.misses} missed`}
                  noteClass="text-key-yellow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
