import { themeById, type ThemeId } from './themes'

export function applyTheme(id: ThemeId) {
  const theme = themeById(id)
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value)
  }
  if (theme.light) {
    root.setAttribute('data-light', '')
  } else {
    root.removeAttribute('data-light')
  }
}
