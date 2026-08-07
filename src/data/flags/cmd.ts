import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // dir
  { tool: 'dir', flag: '/s', desc: 'list files in all subdirectories', category: 'cmd', difficulty: 1 },
  { tool: 'dir', flag: '/b', desc: 'bare format: names only, no headers or summary', category: 'cmd', difficulty: 1 },
  { tool: 'dir', flag: '/a', desc: 'show files with the given attributes, including hidden', category: 'cmd', difficulty: 2 },
  { tool: 'dir', flag: '/o', desc: 'sort the listing, e.g. /o:d by date', category: 'cmd', difficulty: 2 },
  // date / time
  { tool: 'date', flag: '/t', desc: 'display the date without prompting to change it', category: 'cmd', difficulty: 1 },
  { tool: 'time', flag: '/t', desc: 'display the time without prompting to change it', category: 'cmd', difficulty: 1 },
  // xcopy / robocopy
  { tool: 'xcopy', flag: '/e', desc: 'copy all subdirectories, including empty ones', category: 'cmd', difficulty: 1 },
  { tool: 'xcopy', flag: '/i', desc: 'assume the destination is a directory if copying multiple files', category: 'cmd', difficulty: 2 },
  { tool: 'xcopy', flag: '/y', desc: 'overwrite existing files without prompting', category: 'cmd', difficulty: 1 },
  { tool: 'xcopy', flag: '/h', desc: 'copy hidden and system files too', category: 'cmd', difficulty: 2 },
  { tool: 'robocopy', flag: '/MIR', desc: 'mirror the source tree, deleting extra destination files', category: 'cmd', difficulty: 2 },
  { tool: 'robocopy', flag: '/E', desc: 'copy subdirectories, including empty ones', category: 'cmd', difficulty: 2 },
  { tool: 'robocopy', flag: '/Z', desc: 'copy in restartable mode', category: 'cmd', difficulty: 3 },
  { tool: 'robocopy', flag: '/MT', desc: 'multithreaded copy with n threads', category: 'cmd', difficulty: 3 },
  { tool: 'robocopy', flag: '/XD', desc: 'exclude the named directories', category: 'cmd', difficulty: 3 },
  // ipconfig
  { tool: 'ipconfig', flag: '/all', desc: 'show full configuration including mac and dns servers', category: 'cmd', difficulty: 1 },
  { tool: 'ipconfig', flag: '/flushdns', desc: 'clear the dns resolver cache', category: 'cmd', difficulty: 1 },
  { tool: 'ipconfig', flag: '/release', desc: 'release the dhcp lease for the adapter', category: 'cmd', difficulty: 2 },
  { tool: 'ipconfig', flag: '/renew', desc: 'renew the dhcp lease for the adapter', category: 'cmd', difficulty: 2 },
  // tasklist / taskkill
  { tool: 'tasklist', flag: '/fi', desc: 'filter tasks, e.g. by image name or status', category: 'cmd', difficulty: 2 },
  { tool: 'tasklist', flag: '/svc', desc: 'show services hosted in each process', category: 'cmd', difficulty: 2 },
  { tool: 'taskkill', flag: '/im', desc: 'kill processes by image name', category: 'cmd', difficulty: 1 },
  { tool: 'taskkill', flag: '/pid', desc: 'kill the process with the given process id', category: 'cmd', difficulty: 1 },
  { tool: 'taskkill', flag: '/f', desc: 'forcefully terminate the process', category: 'cmd', difficulty: 1 },
  { tool: 'taskkill', flag: '/t', desc: 'also terminate child processes', category: 'cmd', difficulty: 2 },
  // netstat
  { tool: 'netstat', flag: '-ano', desc: 'all connections, numeric addresses, with owning process id', category: 'cmd', difficulty: 2 },
  // disk / system repair
  { tool: 'sfc', flag: '/scannow', desc: 'scan all protected system files and repair them', category: 'cmd', difficulty: 1 },
  { tool: 'sfc', flag: '/verifyonly', desc: 'scan system files without repairing them', category: 'cmd', difficulty: 3 },
  { tool: 'chkdsk', flag: '/f', desc: 'fix errors found on the disk', category: 'cmd', difficulty: 1 },
  { tool: 'chkdsk', flag: '/r', desc: 'locate bad sectors and recover readable data', category: 'cmd', difficulty: 2 },
  { tool: 'dism', flag: '/online', desc: 'target the running operating system image', category: 'cmd', difficulty: 2 },
  { tool: 'dism', flag: '/cleanup-image', desc: 'run cleanup and recovery operations on the image', category: 'cmd', difficulty: 2 },
  { tool: 'dism', flag: '/restorehealth', desc: 'scan for corruption and repair it automatically', category: 'cmd', difficulty: 2 },
  // findstr / fc
  { tool: 'findstr', flag: '/s', desc: 'search in the current directory and all subdirectories', category: 'cmd', difficulty: 1 },
  { tool: 'findstr', flag: '/i', desc: 'case-insensitive search', category: 'cmd', difficulty: 1 },
  { tool: 'findstr', flag: '/n', desc: 'print the line number before each matching line', category: 'cmd', difficulty: 2 },
  { tool: 'findstr', flag: '/v', desc: 'print lines that do not match', category: 'cmd', difficulty: 2 },
  { tool: 'fc', flag: '/n', desc: 'show line numbers in the comparison output', category: 'cmd', difficulty: 2 },
  { tool: 'fc', flag: '/b', desc: 'compare the files byte by byte', category: 'cmd', difficulty: 3 },
  // schtasks / shutdown
  { tool: 'schtasks', flag: '/query', desc: 'list scheduled tasks', category: 'cmd', difficulty: 2 },
  { tool: 'schtasks', flag: '/fo', desc: 'output format: table, list, or csv', category: 'cmd', difficulty: 2 },
  { tool: 'schtasks', flag: '/create', desc: 'create a new scheduled task', category: 'cmd', difficulty: 2 },
  { tool: 'shutdown', flag: '/r', desc: 'restart the computer', category: 'cmd', difficulty: 1 },
  { tool: 'shutdown', flag: '/s', desc: 'shut the computer down', category: 'cmd', difficulty: 1 },
  { tool: 'shutdown', flag: '/t', desc: 'delay in seconds before shutdown or restart', category: 'cmd', difficulty: 1 },
  { tool: 'shutdown', flag: '/a', desc: 'abort a pending shutdown', category: 'cmd', difficulty: 2 },
  // reg
  { tool: 'reg add', flag: '/v', desc: 'name of the registry value to add', category: 'cmd', difficulty: 2 },
  { tool: 'reg add', flag: '/t', desc: 'registry value type, e.g. reg_sz or reg_dword', category: 'cmd', difficulty: 2 },
  { tool: 'reg add', flag: '/d', desc: 'data to store in the registry value', category: 'cmd', difficulty: 2 },
  { tool: 'reg add', flag: '/f', desc: 'overwrite the existing value without prompting', category: 'cmd', difficulty: 2 },
  { tool: 'reg query', flag: '/v', desc: 'query a specific registry value name', category: 'cmd', difficulty: 2 },
  // for
  { tool: 'for', flag: '/f', desc: 'parse text output or file contents line by line', category: 'cmd', difficulty: 3 },
  // powercfg
  { tool: 'powercfg', flag: '/batteryreport', desc: 'generate an html battery health report', category: 'cmd', difficulty: 3 },
  { tool: 'powercfg', flag: '/output', desc: 'path of the report file to write', category: 'cmd', difficulty: 2 },
  { tool: 'powercfg', flag: '/energy', desc: 'analyze energy efficiency and generate a report', category: 'cmd', difficulty: 3 },
  // forfiles
  { tool: 'forfiles', flag: '/p', desc: 'starting path to search from', category: 'cmd', difficulty: 3 },
  { tool: 'forfiles', flag: '/s', desc: 'recurse into subdirectories', category: 'cmd', difficulty: 3 },
  { tool: 'forfiles', flag: '/m', desc: 'search mask, e.g. *.log', category: 'cmd', difficulty: 3 },
  { tool: 'forfiles', flag: '/d', desc: 'select files by last-modified date, e.g. older than n days', category: 'cmd', difficulty: 3 },
  { tool: 'forfiles', flag: '/c', desc: 'command to run for each matched file', category: 'cmd', difficulty: 3 },
  // certutil / takeown
  { tool: 'certutil', flag: '-hashfile', desc: 'compute a file hash with the given algorithm', category: 'cmd', difficulty: 2 },
  { tool: 'takeown', flag: '/f', desc: 'file or directory to take ownership of', category: 'cmd', difficulty: 2 },
  { tool: 'takeown', flag: '/r', desc: 'recurse into subdirectories', category: 'cmd', difficulty: 2 },
  { tool: 'takeown', flag: '/d', desc: 'default answer when the current user lacks list permission', category: 'cmd', difficulty: 3 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  // "-30" is the /d value (files older than 30 days), not a flag
  'forfiles /p C:\\logs /s /m *.log /d -30 /c "cmd /c del @path" :: -30',
  // the extractor treats "time" as a wrapper word, so /t has no tool to attach to
  'time /t :: /t',
]
