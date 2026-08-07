export type CategoryId =
  | 'bash'
  | 'git'
  | 'docker'
  | 'podman'
  | 'kubernetes'
  | 'npm'
  | 'powershell'
  | 'cmd'
  | 'ssh-network'
  | 'vim'
  | 'systemd'
  | 'archives'
  | 'text-tools'
  | 'package-managers'
  | 'cloud'

export type Difficulty = 1 | 2 | 3

export interface CommandEntry {
  /** Exact string to type — single line, printable ASCII, no tabs, no trailing space */
  text: string
  category: CategoryId
  difficulty: Difficulty
  /** One-line explanation shown under the prompt line */
  desc: string
}
