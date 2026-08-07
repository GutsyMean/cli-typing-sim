import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const systemd: CommandEntry[] = [
  // tier 1
  { text: 'systemctl status nginx', category: 'systemd', difficulty: 1, desc: 'show whether a service is running and its recent log' },
  { text: 'systemctl start nginx', category: 'systemd', difficulty: 1, desc: 'start a service now' },
  { text: 'systemctl stop nginx', category: 'systemd', difficulty: 1, desc: 'stop a running service' },
  { text: 'systemctl restart sshd', category: 'systemd', difficulty: 1, desc: 'stop and start a service in one step' },
  { text: 'systemctl reload nginx', category: 'systemd', difficulty: 1, desc: 'reload config without dropping connections' },
  { text: 'systemctl enable docker', category: 'systemd', difficulty: 1, desc: 'start a service automatically at boot' },
  { text: 'systemctl disable bluetooth', category: 'systemd', difficulty: 1, desc: 'stop a service from starting at boot' },
  { text: 'systemctl daemon-reload', category: 'systemd', difficulty: 1, desc: 'reread unit files after editing them' },
  { text: 'systemctl is-active nginx', category: 'systemd', difficulty: 1, desc: 'print just active or inactive for a service' },
  { text: 'systemctl reboot', category: 'systemd', difficulty: 1, desc: 'reboot the machine cleanly' },
  { text: 'systemctl poweroff', category: 'systemd', difficulty: 1, desc: 'shut the machine down cleanly' },
  { text: 'journalctl -e', category: 'systemd', difficulty: 1, desc: 'jump to the end of the journal' },
  { text: 'journalctl -f', category: 'systemd', difficulty: 1, desc: 'follow new journal entries as they arrive' },
  { text: 'timedatectl', category: 'systemd', difficulty: 1, desc: 'show the clock, timezone, and ntp status' },
  { text: 'hostnamectl', category: 'systemd', difficulty: 1, desc: 'show the hostname and machine info' },
  { text: 'loginctl', category: 'systemd', difficulty: 1, desc: 'list current login sessions' },
  // tier 2
  { text: 'systemctl enable --now postgresql', category: 'systemd', difficulty: 2, desc: 'enable at boot and start immediately' },
  { text: 'systemctl list-units --type=service --state=running', category: 'systemd', difficulty: 2, desc: 'every service currently running' },
  { text: 'systemctl list-timers --all', category: 'systemd', difficulty: 2, desc: 'all timers, including inactive ones' },
  { text: 'systemctl cat nginx.service', category: 'systemd', difficulty: 2, desc: 'print a unit file with its drop-ins' },
  { text: 'systemctl show nginx -p MainPID,ActiveState', category: 'systemd', difficulty: 2, desc: 'query specific properties of a unit' },
  { text: 'systemctl mask sleep.target', category: 'systemd', difficulty: 2, desc: 'prevent the system from ever sleeping' },
  { text: 'systemctl edit nginx.service', category: 'systemd', difficulty: 2, desc: 'create a drop-in override for a unit' },
  { text: 'systemctl reset-failed', category: 'systemd', difficulty: 2, desc: 'clear failed state from all units' },
  { text: 'journalctl -u nginx --since today', category: 'systemd', difficulty: 2, desc: 'one service log since midnight' },
  { text: 'journalctl -b -1 -p err', category: 'systemd', difficulty: 2, desc: 'errors from the previous boot' },
  { text: 'journalctl -u sshd -n 50 --no-pager', category: 'systemd', difficulty: 2, desc: 'last 50 ssh log lines, straight to stdout' },
  { text: 'journalctl --disk-usage', category: 'systemd', difficulty: 2, desc: 'how much space the journal takes' },
  { text: 'journalctl --vacuum-size=500M', category: 'systemd', difficulty: 2, desc: 'trim the journal down to 500 megabytes' },
  { text: 'timedatectl set-timezone America/New_York', category: 'systemd', difficulty: 2, desc: 'change the system timezone' },
  { text: 'timedatectl set-ntp true', category: 'systemd', difficulty: 2, desc: 'turn on automatic clock sync' },
  { text: 'hostnamectl set-hostname web01', category: 'systemd', difficulty: 2, desc: 'rename the machine' },
  { text: 'loginctl list-sessions', category: 'systemd', difficulty: 2, desc: 'show who is logged in and from where' },
  // tier 3
  { text: 'systemctl list-unit-files --type=service --state=enabled --no-pager', category: 'systemd', difficulty: 3, desc: 'every service unit enabled at boot' },
  { text: 'journalctl -u nginx.service --since "2026-08-01 00:00" --until "2026-08-01 06:00"', category: 'systemd', difficulty: 3, desc: 'service log for one overnight window' },
  { text: 'journalctl _SYSTEMD_UNIT=sshd.service _PID=1234 -o json-pretty | head -n 40', category: 'systemd', difficulty: 3, desc: 'structured journal entries for one pid' },
  { text: 'journalctl -k -b -p warning --no-pager | tail -n 30', category: 'systemd', difficulty: 3, desc: 'recent kernel warnings from this boot' },
  { text: "journalctl -u docker --grep 'oom' --since yesterday -o short-iso", category: 'systemd', difficulty: 3, desc: 'hunt for out-of-memory kills in the docker log' },
  { text: 'systemd-analyze blame | head -n 15', category: 'systemd', difficulty: 3, desc: 'the fifteen slowest units at boot' },
  { text: 'systemd-analyze critical-chain multi-user.target', category: 'systemd', difficulty: 3, desc: 'the dependency chain that gates boot time' },
  { text: 'systemctl set-property nginx.service MemoryMax=512M CPUQuota=50%', category: 'systemd', difficulty: 3, desc: 'cap a running service with cgroup limits' },
  { text: 'systemd-run --unit=batchjob -p MemoryMax=1G -p Nice=10 ./crunch.sh', category: 'systemd', difficulty: 3, desc: 'run a one-off job as a resource-limited unit' },
  { text: 'systemctl list-dependencies --reverse network-online.target', category: 'systemd', difficulty: 3, desc: 'which units wait for the network to be up' },
  { text: 'systemctl show --property=DefaultLimitNOFILE,DefaultTasksMax', category: 'systemd', difficulty: 3, desc: 'inspect manager-wide default limits' },
  { text: 'loginctl show-user deploy -p Sessions -p State -p IdleHint', category: 'systemd', difficulty: 3, desc: 'session details for one user account' },
  { text: 'hostnamectl set-hostname --pretty "Build Server 01" --static build01', category: 'systemd', difficulty: 3, desc: 'set the pretty and static hostnames together' },
]
