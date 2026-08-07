import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // ls
  { tool: 'ls', flag: '-la', desc: 'long format including hidden entries (-l + -a)', category: 'bash', difficulty: 1 },
  { tool: 'ls', flag: '-lh', desc: 'long format with human-readable sizes (-l + -h)', category: 'bash', difficulty: 1 },
  { tool: 'ls', flag: '-a', desc: 'include hidden entries (names starting with .)', category: 'bash', difficulty: 1 },
  { tool: 'ls', flag: '-l', desc: 'long listing format with permissions, owner and size', category: 'bash', difficulty: 1 },
  { tool: 'ls', flag: '-t', desc: 'sort by modification time, newest first', category: 'bash', difficulty: 2 },
  { tool: 'ls', flag: '-R', desc: 'list subdirectories recursively', category: 'bash', difficulty: 2 },
  // file management
  { tool: 'mkdir', flag: '-p', desc: 'create parent directories as needed, no error if existing', category: 'bash', difficulty: 1 },
  { tool: 'rm', flag: '-rf', desc: 'delete recursively without prompting (-r + -f)', category: 'bash', difficulty: 1 },
  { tool: 'rm', flag: '-r', desc: 'remove directories and their contents recursively', category: 'bash', difficulty: 1 },
  { tool: 'cp', flag: '-r', desc: 'copy directories recursively', category: 'bash', difficulty: 1 },
  { tool: 'mv', flag: '-i', desc: 'prompt before overwriting an existing file', category: 'bash', difficulty: 2 },
  { tool: 'ln', flag: '-s', desc: 'create a symbolic link instead of a hard link', category: 'bash', difficulty: 1 },
  { tool: 'chown', flag: '-R', desc: 'change ownership recursively', category: 'bash', difficulty: 1 },
  { tool: 'chmod', flag: '-R', desc: 'change permissions recursively', category: 'bash', difficulty: 1 },
  // viewing files
  { tool: 'head', flag: '-n', desc: 'output only the first N lines', category: 'bash', difficulty: 1 },
  { tool: 'tail', flag: '-f', desc: 'follow the file, printing new lines as they are appended', category: 'bash', difficulty: 1 },
  { tool: 'tail', flag: '-n', desc: 'output only the last N lines', category: 'bash', difficulty: 1 },
  { tool: 'wc', flag: '-l', desc: 'count lines instead of words and bytes', category: 'bash', difficulty: 1 },
  { tool: 'diff', flag: '-u', desc: 'unified diff format with context lines', category: 'bash', difficulty: 2 },
  // disk usage
  { tool: 'df', flag: '-h', desc: 'human-readable sizes (K, M, G) for filesystem usage', category: 'bash', difficulty: 1 },
  { tool: 'du', flag: '-sh', desc: 'summarized total per argument in human-readable units (-s + -h)', category: 'bash', difficulty: 1 },
  { tool: 'sort', flag: '-h', desc: 'sort by human-readable sizes like 2K or 1G', category: 'bash', difficulty: 2 },
  // find
  { tool: 'find', flag: '-name', desc: 'match files by name pattern', category: 'bash', difficulty: 1 },
  { tool: 'find', flag: '-iname', desc: 'match files by name pattern, case-insensitive', category: 'bash', difficulty: 2 },
  { tool: 'find', flag: '-mtime', desc: 'filter by modification time in days', category: 'bash', difficulty: 2 },
  { tool: 'find', flag: '-type', desc: 'filter by entry type (f = file, d = directory)', category: 'bash', difficulty: 1 },
  { tool: 'find', flag: '-size', desc: 'filter by file size (e.g. +100M = larger than 100 MB)', category: 'bash', difficulty: 2 },
  { tool: 'find', flag: '-exec', desc: 'run a command on each matched file ({} is the file, \\; ends it)', category: 'bash', difficulty: 2 },
  { tool: 'find', flag: '-delete', desc: 'delete each matched file', category: 'bash', difficulty: 2 },
  { tool: 'find', flag: '-maxdepth', desc: 'limit how many directory levels to descend', category: 'bash', difficulty: 2 },
  // processes
  { tool: 'kill', flag: '-9', desc: 'send SIGKILL, forcing immediate termination', category: 'bash', difficulty: 1 },
  { tool: 'ps', flag: '-eo', desc: 'every process with a custom output format (-e + -o)', category: 'bash', difficulty: 3 },
  { tool: 'ps', flag: '--sort', desc: 'sort processes by a column (leading - reverses, e.g. -%mem)', category: 'bash', difficulty: 3 },
  { tool: 'free', flag: '-m', desc: 'show memory amounts in mebibytes', category: 'bash', difficulty: 1 },
  { tool: 'lsof', flag: '-i', desc: 'list open network connections, optionally filtered like :8080', category: 'bash', difficulty: 2 },
  { tool: 'ping', flag: '-c', desc: 'stop after sending N packets', category: 'bash', difficulty: 1 },
  { tool: 'ping', flag: '-W', desc: 'seconds to wait for each reply before timing out', category: 'bash', difficulty: 3 },
  // shell builtins & misc
  { tool: 'read', flag: '-r', desc: 'raw mode: do not treat backslashes as escapes', category: 'bash', difficulty: 2 },
  { tool: 'bash', flag: '-s', desc: 'read commands from stdin, passing later arguments as positional params', category: 'bash', difficulty: 3 },
  { tool: 'comm', flag: '-13', desc: 'suppress columns 1 and 3, leaving lines unique to the second file', category: 'bash', difficulty: 3 },
  { tool: 'uname', flag: '-a', desc: 'print all system information (kernel, hostname, arch)', category: 'bash', difficulty: 1 },
  // rsync
  { tool: 'rsync', flag: '-avz', desc: 'archive mode, verbose, with compression (-a + -v + -z)', category: 'bash', difficulty: 2 },
  { tool: 'rsync', flag: '--progress', desc: 'show per-file transfer progress', category: 'bash', difficulty: 2 },
  { tool: 'rsync', flag: '--exclude', desc: 'skip files matching the given pattern', category: 'bash', difficulty: 2 },
  { tool: 'rsync', flag: '--delete', desc: 'remove destination files that no longer exist at the source', category: 'bash', difficulty: 2 },
  // curl / tar in shell one-liners
  { tool: 'curl', flag: '-fsSL', desc: 'fail on http errors, silent but show errors, follow redirects (-f -s -S -L)', category: 'bash', difficulty: 2 },
  { tool: 'tar', flag: '-czf', desc: 'create a gzip-compressed archive written to the given file (-c + -z + -f)', category: 'bash', difficulty: 1 },
  { tool: 'tar', flag: '--exclude', desc: 'skip files matching the given pattern when archiving', category: 'bash', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  'time ./benchmark.sh --runs 10 :: --runs',
  'curl -fsSL https://example.com/install.sh | bash -s -- --version 2.4 :: --version',
  'kill -9 $(pgrep -f runaway.py) :: -f',
  'xargs -n 1 basename < paths.txt :: -n',
  'watch -n 2 free -m :: -n',
]
