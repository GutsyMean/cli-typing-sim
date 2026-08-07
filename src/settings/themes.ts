export type ThemeId =
  | 'dracula'
  | 'nord'
  | 'gruvbox'
  | 'solarized-dark'
  | 'solarized-light'
  | 'catppuccin'
  | 'classic-green'
  | 'paper'

export interface TerminalTheme {
  id: ThemeId
  label: string
  light: boolean
  /** Adds the CRT scanline overlay to the terminal frame */
  crt?: boolean
  vars: Record<string, string>
}

const t = (vars: Record<string, string>) => vars

export const themes: TerminalTheme[] = [
  {
    id: 'dracula',
    label: 'dracula',
    light: false,
    vars: t({
      '--t-bg': '#282a36',
      '--t-chrome': '#1e1f29',
      '--t-surface': '#21222c',
      '--t-raised': '#343746',
      '--t-fg': '#f8f8f2',
      '--t-dim': '#8a8ca3',
      '--t-faint': '#565869',
      '--t-typed': '#f8f8f2',
      '--t-err': '#ff5555',
      '--t-err-bg': 'rgba(255, 85, 85, 0.14)',
      '--t-accent': '#50fa7b',
      '--t-p-user': '#50fa7b',
      '--t-p-path': '#bd93f9',
      '--t-p-sym': '#f8f8f2',
      '--t-edge': '#3b3d4f',
    }),
  },
  {
    id: 'nord',
    label: 'nord',
    light: false,
    vars: t({
      '--t-bg': '#2e3440',
      '--t-chrome': '#242933',
      '--t-surface': '#292e39',
      '--t-raised': '#3b4252',
      '--t-fg': '#eceff4',
      '--t-dim': '#9aa5b8',
      '--t-faint': '#4c566a',
      '--t-typed': '#eceff4',
      '--t-err': '#bf616a',
      '--t-err-bg': 'rgba(191, 97, 106, 0.16)',
      '--t-accent': '#88c0d0',
      '--t-p-user': '#a3be8c',
      '--t-p-path': '#81a1c1',
      '--t-p-sym': '#eceff4',
      '--t-edge': '#3b4252',
    }),
  },
  {
    id: 'gruvbox',
    label: 'gruvbox',
    light: false,
    vars: t({
      '--t-bg': '#282828',
      '--t-chrome': '#1d2021',
      '--t-surface': '#232323',
      '--t-raised': '#3c3836',
      '--t-fg': '#ebdbb2',
      '--t-dim': '#a89984',
      '--t-faint': '#665c54',
      '--t-typed': '#ebdbb2',
      '--t-err': '#fb4934',
      '--t-err-bg': 'rgba(251, 73, 52, 0.14)',
      '--t-accent': '#fabd2f',
      '--t-p-user': '#b8bb26',
      '--t-p-path': '#83a598',
      '--t-p-sym': '#ebdbb2',
      '--t-edge': '#3c3836',
    }),
  },
  {
    id: 'solarized-dark',
    label: 'solarized dark',
    light: false,
    vars: t({
      '--t-bg': '#002b36',
      '--t-chrome': '#00212b',
      '--t-surface': '#01313f',
      '--t-raised': '#073642',
      '--t-fg': '#93a1a1',
      '--t-dim': '#657b83',
      '--t-faint': '#40565c',
      '--t-typed': '#eee8d5',
      '--t-err': '#dc322f',
      '--t-err-bg': 'rgba(220, 50, 47, 0.16)',
      '--t-accent': '#b58900',
      '--t-p-user': '#859900',
      '--t-p-path': '#268bd2',
      '--t-p-sym': '#93a1a1',
      '--t-edge': '#0a3a47',
    }),
  },
  {
    id: 'solarized-light',
    label: 'solarized light',
    light: true,
    vars: t({
      '--t-bg': '#fdf6e3',
      '--t-chrome': '#eee8d5',
      '--t-surface': '#f5efdc',
      '--t-raised': '#e8e1cd',
      '--t-fg': '#586e75',
      '--t-dim': '#93a1a1',
      '--t-faint': '#c9c2af',
      '--t-typed': '#073642',
      '--t-err': '#dc322f',
      '--t-err-bg': 'rgba(220, 50, 47, 0.12)',
      '--t-accent': '#cb4b16',
      '--t-p-user': '#859900',
      '--t-p-path': '#268bd2',
      '--t-p-sym': '#586e75',
      '--t-edge': '#ddd6c1',
    }),
  },
  {
    id: 'catppuccin',
    label: 'catppuccin',
    light: false,
    vars: t({
      '--t-bg': '#1e1e2e',
      '--t-chrome': '#181825',
      '--t-surface': '#1b1b2b',
      '--t-raised': '#313244',
      '--t-fg': '#cdd6f4',
      '--t-dim': '#8f94b3',
      '--t-faint': '#585b70',
      '--t-typed': '#cdd6f4',
      '--t-err': '#f38ba8',
      '--t-err-bg': 'rgba(243, 139, 168, 0.14)',
      '--t-accent': '#cba6f7',
      '--t-p-user': '#a6e3a1',
      '--t-p-path': '#89b4fa',
      '--t-p-sym': '#cdd6f4',
      '--t-edge': '#313244',
    }),
  },
  {
    id: 'classic-green',
    label: 'classic green',
    light: false,
    crt: true,
    vars: t({
      '--t-bg': '#050d05',
      '--t-chrome': '#020602',
      '--t-surface': '#07120a',
      '--t-raised': '#0d2412',
      '--t-fg': '#33ff66',
      '--t-dim': '#1d9c44',
      '--t-faint': '#11552a',
      '--t-typed': '#7dffa3',
      '--t-err': '#ff4444',
      '--t-err-bg': 'rgba(255, 68, 68, 0.16)',
      '--t-accent': '#33ff66',
      '--t-p-user': '#33ff66',
      '--t-p-path': '#22cc55',
      '--t-p-sym': '#33ff66',
      '--t-edge': '#123a1e',
    }),
  },
  {
    id: 'paper',
    label: 'paper',
    light: true,
    vars: t({
      '--t-bg': '#ffffff',
      '--t-chrome': '#f2f0ec',
      '--t-surface': '#faf8f5',
      '--t-raised': '#eceae4',
      '--t-fg': '#3d3d3d',
      '--t-dim': '#9a968e',
      '--t-faint': '#d4d0c8',
      '--t-typed': '#111111',
      '--t-err': '#d13438',
      '--t-err-bg': 'rgba(209, 52, 56, 0.1)',
      '--t-accent': '#0f6cbd',
      '--t-p-user': '#107c10',
      '--t-p-path': '#0f6cbd',
      '--t-p-sym': '#3d3d3d',
      '--t-edge': '#e2ded6',
    }),
  },
]

export const themeById = (id: ThemeId): TerminalTheme =>
  themes.find((t) => t.id === id) ?? themes[0]
