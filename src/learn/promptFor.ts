import type { CategoryId } from '../data/types'
import { categoryPrompt, promptById, type PromptId } from '../settings/prompts'

export const promptFor = (setting: 'auto' | PromptId, category: CategoryId) =>
  promptById(setting === 'auto' ? categoryPrompt[category] : setting)
