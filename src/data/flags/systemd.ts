import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // journalctl
  { tool: 'journalctl', flag: '-u', desc: 'show logs for the given unit only', category: 'systemd', difficulty: 1 },
  { tool: 'journalctl', flag: '-f', desc: 'follow the journal, printing new entries as they arrive', category: 'systemd', difficulty: 1 },
  { tool: 'journalctl', flag: '-e', desc: 'jump to the end of the journal in the pager', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-n', desc: 'show only the last N entries', category: 'systemd', difficulty: 1 },
  { tool: 'journalctl', flag: '-b', desc: 'show logs from a specific boot (no argument = current boot)', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-1', desc: 'boot offset used with -b: -1 selects the previous boot', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-p', desc: 'filter by priority (e.g. err, warning)', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-k', desc: 'show only kernel messages (like dmesg)', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-o', desc: 'select output format (e.g. json-pretty, short-iso)', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-r', desc: 'show newest entries first (reverse order)', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '-x', desc: 'augment log lines with explanatory catalog text', category: 'systemd', difficulty: 3 },
  { tool: 'journalctl', flag: '--since', desc: 'show entries on or after the given time (e.g. today, yesterday)', category: 'systemd', difficulty: 1 },
  { tool: 'journalctl', flag: '--until', desc: 'show entries up to the given time', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '--no-pager', desc: 'print straight to stdout without invoking a pager', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '--grep', desc: 'show only entries whose message matches the given pattern', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '--disk-usage', desc: 'show how much disk space the journal is using', category: 'systemd', difficulty: 2 },
  { tool: 'journalctl', flag: '--vacuum-size', desc: 'delete oldest journal files until usage is below the given size', category: 'systemd', difficulty: 3 },
  { tool: 'journalctl', flag: '--list-boots', desc: 'list recorded boots with their offsets and time ranges', category: 'systemd', difficulty: 3 },
  // systemctl
  { tool: 'systemctl', flag: '--now', desc: 'also start (or stop) the unit when enabling (or disabling) it', category: 'systemd', difficulty: 1 },
  { tool: 'systemctl', flag: '--type', desc: 'limit listed units to the given type (e.g. service)', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--state', desc: 'limit listed units to the given state (e.g. running, enabled)', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--all', desc: 'include inactive units in listings', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--no-pager', desc: 'print straight to stdout without invoking a pager', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--failed', desc: 'list only units in a failed state', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--user', desc: 'operate on the per-user service manager instead of the system one', category: 'systemd', difficulty: 2 },
  { tool: 'systemctl', flag: '--reverse', desc: 'show units that depend on this one instead of its dependencies', category: 'systemd', difficulty: 3 },
  { tool: 'systemctl show', flag: '-p', desc: 'show only the given properties of a unit or the manager', category: 'systemd', difficulty: 3 },
  { tool: 'systemctl show', flag: '--property', desc: 'show only the given properties of a unit or the manager', category: 'systemd', difficulty: 3 },
  // systemd-run / loginctl / hostnamectl
  { tool: 'systemd-run', flag: '--unit', desc: 'name the transient unit instead of getting a generated name', category: 'systemd', difficulty: 3 },
  { tool: 'systemd-run', flag: '-p', desc: 'set a unit property on the transient unit (e.g. MemoryMax=1G)', category: 'systemd', difficulty: 3 },
  { tool: 'loginctl', flag: '-p', desc: 'show only the given properties of a session, user or seat', category: 'systemd', difficulty: 3 },
  { tool: 'hostnamectl', flag: '--pretty', desc: 'set the free-form pretty hostname', category: 'systemd', difficulty: 2 },
  { tool: 'hostnamectl', flag: '--static', desc: 'set the static hostname stored in /etc/hostname', category: 'systemd', difficulty: 2 },
  // helpers appearing in systemd pipelines
  { tool: 'head', flag: '-n', desc: 'output only the first N lines', category: 'systemd', difficulty: 1 },
  { tool: 'tail', flag: '-n', desc: 'output only the last N lines', category: 'systemd', difficulty: 1 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
