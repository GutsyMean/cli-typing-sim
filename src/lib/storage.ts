/**
 * localStorage that degrades to in-memory (private-mode Safari, quota errors).
 */
const memory = new Map<string, string>()

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key) ?? memory.get(key) ?? null
    } catch {
      return memory.get(key) ?? null
    }
  },
  setItem(key: string, value: string) {
    memory.set(key, value)
    try {
      localStorage.setItem(key, value)
    } catch {
      /* in-memory only */
    }
  },
  removeItem(key: string) {
    memory.delete(key)
    try {
      localStorage.removeItem(key)
    } catch {
      /* in-memory only */
    }
  },
}
