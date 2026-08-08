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
    <span className="flex h-3 flex-1 overflow-hidden border-2 border-nylon bg-white">
      <span className="h-full bg-nylon" style={{ width: `${m}%` }} />
      <span className="h-full bg-nylon/30" style={{ width: `${l}%` }} />
    </span>
  )
}

function ItemRow({ item, note, noteClass }: { item: StudyItem; note: string; noteClass: string }) {
  return (
    <div className="plate flex items-baseline justify-between gap-4 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate font-mono text-sm font-bold text-nylon">
          {itemLabel(item)}
          {item.kind === 'flag' && (
            <span className="ml-2 bg-nylon px-1.5 py-0.5 font-sans text-[9px] font-extrabold text-cotton uppercase">
              flag
            </span>
          )}
        </div>
        <div className="truncate font-sans text-xs text-nylon-soft">{itemDesc(item)}</div>
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
      <p className="plate px-4 py-6 text-center font-sans text-[13px] text-nylon-soft">
        &ldquo;empty&rdquo; — hit start learning and your mastery progress will build here.
      </p>
    )
  }

  const commandCount = items.filter((i) => i.kind === 'command').length
  const flagCount = items.length - commandCount

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <span className="font-sans text-sm font-semibold text-nylon">
            <span className="bg-nylon px-1.5 font-mono font-bold text-cotton">{mastered.length}</span>
            <span className="text-nylon-soft"> / {items.length}</span> mastered in your selection
            <span className="text-nylon-soft">
              {' '}
              ({commandCount > 0 && `${commandCount} commands`}
              {commandCount > 0 && flagCount > 0 && ' · '}
              {flagCount > 0 && `${flagCount} flags`})
            </span>
            {learning.length > 0 && (
              <span className="text-nylon-soft"> · {learning.length} in progress</span>
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
            className={`font-sans text-xs font-bold ${
              resetArmed ? 'ziptag' : 'text-nylon-soft underline hover:text-nylon'
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
            <span className="w-28 shrink-0 font-mono text-xs font-bold text-nylon">{categoryLabel(c.id)}</span>
            <Bar mastered={c.mastered} learning={c.learning} total={c.total} />
            <span className="w-16 text-right font-sans text-xs text-nylon-soft tabular-nums">
              {c.mastered}/{c.total}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {recentlyMastered.length > 0 && (
          <div>
            <h3 className="quoted mb-2 text-[12px] text-nylon">recently mastered</h3>
            <div className="flex flex-col gap-2">
              {recentlyMastered.map(([i]) => (
                <ItemRow key={studyKey(i)} item={i} note="✓" noteClass="text-nylon" />
              ))}
            </div>
          </div>
        )}
        {needsWork.length > 0 && (
          <div>
            <h3 className="quoted mb-2 text-[12px] text-nylon">needs work</h3>
            <div className="flex flex-col gap-2">
              {needsWork.map(([i, r]) => (
                <ItemRow
                  key={studyKey(i)}
                  item={i}
                  note={`×${r.misses} missed`}
                  noteClass="text-tag"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
