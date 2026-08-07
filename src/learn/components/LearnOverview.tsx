import { useState } from 'react'
import { allCommands, categoryLabel, categories as allCategories } from '../../data/commands'
import { filterPool } from '../../data/generator'
import type { CommandEntry } from '../../data/types'
import { useSettings } from '../../settings/settingsStore'
import { commandKey, useLearn, type MasteryRecord } from '../learnStore'

interface CategoryProgress {
  id: CommandEntry['category']
  mastered: number
  learning: number
  total: number
}

function Bar({ mastered, learning, total }: { mastered: number; learning: number; total: number }) {
  const m = total === 0 ? 0 : (mastered / total) * 100
  const l = total === 0 ? 0 : (learning / total) * 100
  return (
    <span className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
      <span className="h-full bg-accent" style={{ width: `${m}%` }} />
      <span className="h-full bg-accent/35" style={{ width: `${l}%` }} />
    </span>
  )
}

function CommandRow({ entry, note, noteClass }: { entry: CommandEntry; note: string; noteClass: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-lg border border-edge bg-surface px-3 py-2">
      <div className="min-w-0">
        <div className="truncate font-mono text-sm text-fg">{entry.text}</div>
        <div className="truncate font-sans text-xs text-faint">{entry.desc}</div>
      </div>
      <span className={`shrink-0 font-sans text-xs ${noteClass}`}>{note}</span>
    </div>
  )
}

export function LearnOverview() {
  const records = useLearn((s) => s.records)
  const reset = useLearn((s) => s.reset)
  const selectedCategories = useSettings((s) => s.categories)
  const difficulties = useSettings((s) => s.difficulties)
  const [resetArmed, setResetArmed] = useState(false)

  const pool = filterPool(allCommands, selectedCategories, difficulties)
  const level = (e: CommandEntry) => records[commandKey(e)]?.level ?? 0

  const mastered = pool.filter((e) => level(e) === 3)
  const learning = pool.filter((e) => level(e) > 0 && level(e) < 3)

  const byCategory: CategoryProgress[] = allCategories
    .filter((c) => selectedCategories.includes(c.id))
    .map((c) => {
      const entries = pool.filter((e) => e.category === c.id)
      return {
        id: c.id,
        mastered: entries.filter((e) => level(e) === 3).length,
        learning: entries.filter((e) => level(e) > 0 && level(e) < 3).length,
        total: entries.length,
      }
    })

  const withRecord = (e: CommandEntry): [CommandEntry, MasteryRecord] | null => {
    const r = records[commandKey(e)]
    return r ? [e, r] : null
  }
  const recentlyMastered = mastered
    .map(withRecord)
    .filter((x): x is [CommandEntry, MasteryRecord] => x !== null)
    .sort((a, b) => b[1].lastSeen - a[1].lastSeen)
    .slice(0, 5)
  const needsWork = pool
    .map(withRecord)
    .filter((x): x is [CommandEntry, MasteryRecord] => x !== null)
    .filter(([e, r]) => r.misses > 0 && level(e) < 3)
    .sort((a, b) => b[1].misses - a[1].misses)
    .slice(0, 5)

  const anyProgress = Object.keys(records).length > 0

  if (!anyProgress) {
    return (
      <p className="rounded-lg border border-dashed border-edge px-4 py-6 text-center font-sans text-[13px] text-faint">
        nothing learned yet — hit start learning and your mastery progress will build here.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <span className="font-sans text-sm text-dim">
            <span className="font-mono font-semibold text-accent">{mastered.length}</span>
            <span className="text-faint"> / {pool.length}</span> commands mastered in your
            selection
            {learning.length > 0 && (
              <span className="text-faint"> · {learning.length} in progress</span>
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
              resetArmed ? 'font-semibold text-err' : 'text-faint hover:text-dim'
            }`}
          >
            {resetArmed ? 'click again to wipe all progress' : 'reset progress'}
          </button>
        </div>
        <Bar mastered={mastered.length} learning={learning.length} total={pool.length} />
      </div>

      <div className="flex flex-col gap-2">
        {byCategory.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 font-mono text-xs text-fg">{categoryLabel(c.id)}</span>
            <Bar mastered={c.mastered} learning={c.learning} total={c.total} />
            <span className="w-16 text-right font-sans text-xs text-dim tabular-nums">
              {c.mastered}/{c.total}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {recentlyMastered.length > 0 && (
          <div>
            <h3 className="mb-2 font-sans text-xs font-medium text-faint">recently mastered</h3>
            <div className="flex flex-col gap-2">
              {recentlyMastered.map(([e]) => (
                <CommandRow key={commandKey(e)} entry={e} note="✓" noteClass="text-accent" />
              ))}
            </div>
          </div>
        )}
        {needsWork.length > 0 && (
          <div>
            <h3 className="mb-2 font-sans text-xs font-medium text-faint">needs work</h3>
            <div className="flex flex-col gap-2">
              {needsWork.map(([e, r]) => (
                <CommandRow
                  key={commandKey(e)}
                  entry={e}
                  note={`×${r.misses} missed`}
                  noteClass="text-err"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
