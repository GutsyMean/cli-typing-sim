import type { CategoryId } from '../data/types'

export type PromptId =
  | 'bash'
  | 'root'
  | 'zsh'
  | 'powershell'
  | 'cmd'
  | 'container'

export interface PromptSegment {
  text: string
  /** maps to prompt color tokens */
  color: 'user' | 'path' | 'sym'
}

export interface PromptStyle {
  id: PromptId
  label: string
  segments: PromptSegment[]
}

export const promptStyles: PromptStyle[] = [
  {
    id: 'bash',
    label: 'user@host:~$',
    segments: [
      { text: 'dev@local', color: 'user' },
      { text: ':', color: 'sym' },
      { text: '~/projects', color: 'path' },
      { text: '$ ', color: 'sym' },
    ],
  },
  {
    id: 'root',
    label: 'root@server:~#',
    segments: [
      { text: 'root@server', color: 'user' },
      { text: ':', color: 'sym' },
      { text: '/etc', color: 'path' },
      { text: '# ', color: 'sym' },
    ],
  },
  {
    id: 'zsh',
    label: '❯ (minimal)',
    segments: [{ text: '❯ ', color: 'user' }],
  },
  {
    id: 'powershell',
    label: 'PS C:\\>',
    segments: [
      { text: 'PS ', color: 'sym' },
      { text: 'C:\\Users\\dev', color: 'path' },
      { text: '> ', color: 'sym' },
    ],
  },
  {
    id: 'cmd',
    label: 'C:\\>',
    segments: [
      { text: 'C:\\Users\\dev', color: 'path' },
      { text: '>', color: 'sym' },
    ],
  },
  {
    id: 'container',
    label: 'root@container:/app#',
    segments: [
      { text: 'root@f2a91c3', color: 'user' },
      { text: ':', color: 'sym' },
      { text: '/app', color: 'path' },
      { text: '# ', color: 'sym' },
    ],
  },
]

export const promptById = (id: PromptId): PromptStyle =>
  promptStyles.find((p) => p.id === id) ?? promptStyles[0]

/** Native prompt for each category, used by the "auto" prompt setting. */
export const categoryPrompt: Record<CategoryId, PromptId> = {
  bash: 'bash',
  git: 'bash',
  docker: 'bash',
  podman: 'bash',
  kubernetes: 'zsh',
  npm: 'bash',
  powershell: 'powershell',
  cmd: 'cmd',
  'ssh-network': 'bash',
  vim: 'zsh',
  systemd: 'root',
  archives: 'bash',
  'text-tools': 'bash',
  'package-managers': 'root',
  cloud: 'zsh',
}
