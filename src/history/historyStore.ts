import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CategoryId, Difficulty } from '../data/types'
import type { TestMode } from '../settings/settingsStore'
import { safeStorage } from '../lib/storage'

export interface HistoryEntry {
  ts: number
  wpm: number
  raw: number
  accuracy: number
  consistency: number
  mode: TestMode
  /** seconds for timed mode, command count otherwise */
  amount: number
  categories: CategoryId[]
  difficulties: Difficulty[]
}

interface HistoryStore {
  entries: HistoryEntry[]
  add: (entry: HistoryEntry) => void
  clear: () => void
}

const MAX_ENTRIES = 500

export const useHistory = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((state) => ({
          entries: [...state.entries, entry].slice(-MAX_ENTRIES),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: 'termtype:history:v1',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)
