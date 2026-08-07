import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CategoryId, Difficulty } from '../data/types'
import type { PromptId } from './prompts'
import type { ThemeId } from './themes'
import { safeStorage } from '../lib/storage'

export type TestMode = 'timed' | 'commands' | 'endless'
export type CaretStyle = 'block' | 'line' | 'underscore'
export type FontSize = 'sm' | 'md' | 'lg' | 'xl'
export type Behavior = 'forgiving' | 'stop-on-error'

export interface Settings {
  mode: TestMode
  duration: 15 | 30 | 60 | 120
  commandCount: 10 | 25 | 50
  categories: CategoryId[]
  difficulties: Difficulty[]
  theme: ThemeId
  promptStyle: 'auto' | PromptId
  caretStyle: CaretStyle
  caretBlink: boolean
  fontSize: FontSize
  soundEnabled: boolean
  errorSoundEnabled: boolean
  behavior: Behavior
  showLiveStats: boolean
  showDescriptions: boolean
}

interface SettingsStore extends Settings {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  toggleCategory: (id: CategoryId) => void
  toggleDifficulty: (d: Difficulty) => void
}

export const defaultSettings: Settings = {
  mode: 'timed',
  duration: 30,
  commandCount: 10,
  categories: ['bash', 'git'],
  difficulties: [1, 2],
  theme: 'dracula',
  promptStyle: 'auto',
  caretStyle: 'block',
  caretBlink: true,
  fontSize: 'md',
  soundEnabled: false,
  errorSoundEnabled: false,
  behavior: 'forgiving',
  showLiveStats: true,
  showDescriptions: true,
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      set: (key, value) => set({ [key]: value }),
      toggleCategory: (id) => {
        const current = get().categories
        const next = current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id]
        // never allow zero categories
        if (next.length > 0) set({ categories: next })
      },
      toggleDifficulty: (d) => {
        const current = get().difficulties
        const next = current.includes(d)
          ? current.filter((x) => x !== d)
          : [...current, d].sort()
        if (next.length > 0) set({ difficulties: next })
      },
    }),
    {
      name: 'termtype:settings:v1',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

export const fontSizeRem: Record<FontSize, string> = {
  sm: '1rem',
  md: '1.125rem',
  lg: '1.3rem',
  xl: '1.5rem',
}
