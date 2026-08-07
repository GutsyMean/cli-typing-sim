/**
 * GENERATED FILE — do not edit by hand. Regenerate with: npm run import:data
 * Flag descriptions imported from @withfig/autocomplete
 * (https://github.com/withfig/autocomplete), licensed ISC.
 */
import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  { tool: "systemctl", flag: "--mkdir", desc: "Create directory before mounting, if missing", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--now", desc: "Start or stop unit after enabling or disabling it", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--plain", desc: "Print unit dependencies as a list instead of a tree", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--root", desc: "Edit/enable/disable/mask unit files in the specified root directory", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--state", desc: "List units with particular LOAD or SUB or ACTIVE state", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--user", desc: "Connect to user service manager", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--value", desc: "When showing properties, only print the value", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--wait", desc: "For (re)start, wait until service stopped again. For is-system-running, wait until startup is completed", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "--what", desc: "Which types of resources to remove", category: "systemd", difficulty: 2 },
  { tool: "systemctl", flag: "-a", desc: "Show all properties/all units currently in memory, including dead/empty ones. To list all units installed on the system, use 'list-unit-files' instead (also --all)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-f", desc: "When enabling unit files, override existing symlinks. When shutting down, execute action immediately (also --force)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-h", desc: "Show this help (also --help)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-H", desc: "Operate on remote host (also --host)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-i", desc: "Shortcut for --check-inhibitors=no", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-l", desc: "Don't ellipsize unit names on output (also --full)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-M", desc: "Operate on a local container (also --machine)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-n", desc: "Number of journal entries to show (also --lines)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-o", desc: "Change journal output mode (also --output)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-p", desc: "Show only properties by this name (also --property)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-P", desc: "Equivalent to --value --property=NAME", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-q", desc: "Supress output (also --quiet)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-r", desc: "Show unit list of host and local containers (also --recursive)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-s", desc: "Which signal to send (also --signal)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-t", desc: "List units of a particular type (also --type)", category: "systemd", difficulty: 1 },
  { tool: "systemctl", flag: "-T", desc: "When enqueuing a unit job, show full transaction (also --show-transaction)", category: "systemd", difficulty: 1 },
]

/** command flags with no upstream description (auto-generated) */
export const coverageExceptions: string[] = [
  "coredumpctl debug -A \"-iex 'set debuginfod enabled on' -iex 'set pagination off' -ex bt\" :: -A",
  "coredumpctl dump date -o notes.txt :: -o",
  "journalctl --vacuum-time 2d :: --vacuum-time",
  "journalctl -b -1 -p 3 :: -b",
  "journalctl -b -1 -p 3 :: -1",
  "journalctl -b -1 -p 3 :: -p",
  "journalctl -n 10 -f :: -n",
  "journalctl -n 10 -f :: -f",
  "journalctl -S now -U \"YYYY-MM-DD\" :: -S",
  "journalctl -S now -U \"YYYY-MM-DD\" :: -U",
  "journalctl -u nginx.service :: -u",
  "loginctl -h :: -h",
  "loginctl list-users -H example.com :: -H",
  "loginctl show-session session-id -a :: -a",
  "loginctl show-user admin -p property :: -p",
  "resolvectl --legend no -t MX query domain :: --legend",
  "resolvectl --legend no -t MX query domain :: -t",
  "sudo hostnamectl set-hostname --pretty \"\" :: --pretty",
  "systemctl --failed :: --failed",
  "systemd-analyze cat-config udev/rules.d --tldr :: --tldr",
  "systemd-analyze dot | dot -T svg > file.svg :: -T",
]
