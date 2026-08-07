import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CommandEntry } from '../data/types'
import { safeStorage } from '../lib/storage'

export type MasteryLevel = 0 | 1 | 2 | 3

export const commandKey = (e: Pick<CommandEntry, 'category' | 'text'>): string =>
  `${e.category}:${e.text}`

export interface MasteryRecord {
  level: MasteryLevel
  lastSeen: number
  misses: number
}

interface LearnStore {
  records: Record<string, MasteryRecord>
  bump: (key: string, level: MasteryLevel, missed: boolean) => void
  reset: () => void
}

export const useLearn = create<LearnStore>()(
  persist(
    (set) => ({
      records: {},
      bump: (key, level, missed) =>
        set((state) => ({
          records: {
            ...state.records,
            [key]: {
              level,
              lastSeen: Date.now(),
              misses: (state.records[key]?.misses ?? 0) + (missed ? 1 : 0),
            },
          },
        })),
      reset: () => set({ records: {} }),
    }),
    {
      name: 'termtype:learn:v1',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)
