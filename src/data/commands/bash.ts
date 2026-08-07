import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const bash: CommandEntry[] = [
  // tier 1
  { text: 'ls -la', category: 'bash', difficulty: 1, desc: 'list all files in long format, including hidden' },
  { text: 'cd ~/projects', category: 'bash', difficulty: 1, desc: 'change to the projects directory' },
  { text: 'pwd', category: 'bash', difficulty: 1, desc: 'print the current working directory' },
  { text: 'mkdir -p src/utils', category: 'bash', difficulty: 1, desc: 'create nested directories in one go' },
  { text: 'rm -rf node_modules', category: 'bash', difficulty: 1, desc: 'delete a directory tree without prompting' },
  { text: 'cp config.yml config.yml.bak', category: 'bash', difficulty: 1, desc: 'back up a file before editing' },
  { text: 'mv draft.md posts/final.md', category: 'bash', difficulty: 1, desc: 'move and rename a file' },
  { text: 'cat /etc/os-release', category: 'bash', difficulty: 1, desc: 'show which distro you are running' },
  { text: 'touch .env.local', category: 'bash', difficulty: 1, desc: 'create an empty file' },
  { text: 'head -n 20 error.log', category: 'bash', difficulty: 1, desc: 'show the first 20 lines of a file' },
  { text: 'tail -f /var/log/syslog', category: 'bash', difficulty: 1, desc: 'follow a log file as it grows' },
  { text: 'which python3', category: 'bash', difficulty: 1, desc: 'show the full path of a command' },
  { text: 'echo $PATH', category: 'bash', difficulty: 1, desc: 'print the executable search path' },
  { text: 'df -h', category: 'bash', difficulty: 1, desc: 'show disk usage in human-readable units' },
  { text: 'history | tail', category: 'bash', difficulty: 1, desc: 'show your most recent commands' },
  { text: 'clear', category: 'bash', difficulty: 1, desc: 'wipe the terminal screen' },
  // tier 2
  { text: 'du -sh */ | sort -h', category: 'bash', difficulty: 2, desc: 'directory sizes, smallest to largest' },
  { text: 'find . -name "*.log" -mtime +7 -delete', category: 'bash', difficulty: 2, desc: 'delete log files older than 7 days' },
  { text: 'chmod +x deploy.sh', category: 'bash', difficulty: 2, desc: 'make a script executable' },
  { text: 'chown -R www-data:www-data /var/www', category: 'bash', difficulty: 2, desc: 'recursively change file ownership' },
  { text: 'ps aux | grep nginx', category: 'bash', difficulty: 2, desc: 'find running processes by name' },
  { text: 'kill -9 $(pgrep -f runaway.py)', category: 'bash', difficulty: 2, desc: 'force-kill processes matching a pattern' },
  { text: 'ln -s /opt/app/current ~/app', category: 'bash', difficulty: 2, desc: 'create a symbolic link' },
  { text: 'wc -l src/**/*.ts', category: 'bash', difficulty: 2, desc: 'count lines across TypeScript files' },
  { text: 'diff -u old.conf new.conf', category: 'bash', difficulty: 2, desc: 'compare two files in unified format' },
  { text: 'xargs -n 1 basename < paths.txt', category: 'bash', difficulty: 2, desc: 'strip directories from a list of paths' },
  { text: 'watch -n 2 free -m', category: 'bash', difficulty: 2, desc: 're-run a memory check every 2 seconds' },
  { text: 'nohup ./worker.sh > worker.log 2>&1 &', category: 'bash', difficulty: 2, desc: 'run a job immune to hangups, log everything' },
  { text: 'export NODE_ENV=production', category: 'bash', difficulty: 2, desc: 'set an environment variable for this shell' },
  { text: 'alias gs="git status"', category: 'bash', difficulty: 2, desc: 'define a shell alias' },
  { text: 'sudo lsof -i :8080', category: 'bash', difficulty: 2, desc: 'find which process holds a port' },
  { text: 'time ./benchmark.sh --runs 10', category: 'bash', difficulty: 2, desc: 'measure how long a command takes' },
  // tier 3
  { text: 'rsync -avz --progress --exclude "node_modules" ./src/ deploy@web01:/var/www/app/', category: 'bash', difficulty: 3, desc: 'sync a tree to a remote host, showing progress' },
  { text: 'find /var/log -type f -size +100M -exec ls -lh {} \\;', category: 'bash', difficulty: 3, desc: 'list log files larger than 100 MB' },
  { text: 'for f in *.png; do convert "$f" "${f%.png}.webp"; done', category: 'bash', difficulty: 3, desc: 'batch-convert images in a shell loop' },
  { text: 'curl -fsSL https://example.com/install.sh | bash -s -- --version 2.4', category: 'bash', difficulty: 3, desc: 'download and run an installer with args' },
  { text: 'tar -czf backup-$(date +%F).tar.gz --exclude ".cache" ~/projects', category: 'bash', difficulty: 3, desc: 'dated compressed backup, skipping caches' },
  { text: 'ps -eo pid,ppid,%cpu,%mem,cmd --sort=-%mem | head -n 15', category: 'bash', difficulty: 3, desc: 'top 15 processes by memory usage' },
  { text: 'trap "rm -f $TMPFILE" EXIT INT TERM', category: 'bash', difficulty: 3, desc: 'clean up a temp file on script exit' },
  { text: 'comm -13 <(sort a.txt) <(sort b.txt) > only-in-b.txt', category: 'bash', difficulty: 3, desc: 'lines unique to the second file' },
  { text: 'dd if=/dev/zero of=testfile bs=1M count=1024 status=progress', category: 'bash', difficulty: 3, desc: 'write a 1 GB test file with progress' },
  { text: 'while read -r host; do ping -c 1 -W 1 "$host" && echo "$host up"; done < hosts.txt', category: 'bash', difficulty: 3, desc: 'check reachability of every host in a file' },
]
