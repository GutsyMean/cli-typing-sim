import type { CategoryId, CommandEntry } from '../types'
import { bash } from './bash'
import { git } from './git'
import { docker } from './docker'
import { podman } from './podman'
import { kubernetes } from './kubernetes'
import { npm } from './npm'
import { powershell } from './powershell'
import { cmd } from './cmd'
import { sshNetwork } from './ssh-network'
import { vim } from './vim'
import { systemd } from './systemd'
import { archives } from './archives'
import { textTools } from './text-tools'
import { packageManagers } from './package-managers'
import { cloud } from './cloud'

export const allCommands: CommandEntry[] = [
  ...bash,
  ...git,
  ...docker,
  ...podman,
  ...kubernetes,
  ...npm,
  ...powershell,
  ...cmd,
  ...sshNetwork,
  ...vim,
  ...systemd,
  ...archives,
  ...textTools,
  ...packageManagers,
  ...cloud,
]

export interface CategoryMeta {
  id: CategoryId
  label: string
  blurb: string
}

export const categories: CategoryMeta[] = [
  { id: 'bash', label: 'bash', blurb: 'everyday Linux shell' },
  { id: 'git', label: 'git', blurb: 'version control' },
  { id: 'docker', label: 'docker', blurb: 'containers' },
  { id: 'podman', label: 'podman', blurb: 'daemonless containers' },
  { id: 'kubernetes', label: 'kubectl', blurb: 'cluster ops' },
  { id: 'npm', label: 'npm & node', blurb: 'JS tooling' },
  { id: 'powershell', label: 'powershell', blurb: 'Windows shell' },
  { id: 'cmd', label: 'cmd.exe', blurb: 'Windows classic' },
  { id: 'ssh-network', label: 'ssh & net', blurb: 'remote & network' },
  { id: 'vim', label: 'vim', blurb: 'editor commands' },
  { id: 'systemd', label: 'systemd', blurb: 'services & logs' },
  { id: 'archives', label: 'archives', blurb: 'tar, zip & friends' },
  { id: 'text-tools', label: 'text tools', blurb: 'grep, sed, awk, jq' },
  { id: 'package-managers', label: 'packages', blurb: 'apt, dnf, pacman, brew' },
  { id: 'cloud', label: 'cloud CLIs', blurb: 'aws, gcloud, az' },
]

export const categoryLabel = (id: CategoryId): string =>
  categories.find((c) => c.id === id)?.label ?? id
