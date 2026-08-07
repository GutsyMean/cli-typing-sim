import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const powershell: CommandEntry[] = [
  // tier 1
  { text: 'Get-Process', category: 'powershell', difficulty: 1, desc: 'list all running processes' },
  { text: 'Get-Service', category: 'powershell', difficulty: 1, desc: 'list services and their status' },
  { text: 'Get-ChildItem', category: 'powershell', difficulty: 1, desc: 'list files in the current directory' },
  { text: 'Get-Location', category: 'powershell', difficulty: 1, desc: 'print the current working directory' },
  { text: 'Set-Location $HOME', category: 'powershell', difficulty: 1, desc: 'change to your home directory' },
  { text: 'Get-Date', category: 'powershell', difficulty: 1, desc: 'show the current date and time' },
  { text: 'Clear-Host', category: 'powershell', difficulty: 1, desc: 'wipe the console screen' },
  { text: 'Get-History', category: 'powershell', difficulty: 1, desc: 'show commands run in this session' },
  { text: 'Get-Command git', category: 'powershell', difficulty: 1, desc: 'find where a command comes from' },
  { text: 'Get-Alias ls', category: 'powershell', difficulty: 1, desc: 'show what an alias points to' },
  { text: 'Get-Content error.log', category: 'powershell', difficulty: 1, desc: 'print the contents of a file' },
  { text: 'Copy-Item app.log app.log.bak', category: 'powershell', difficulty: 1, desc: 'back up a file before editing' },
  { text: 'Remove-Item temp.txt', category: 'powershell', difficulty: 1, desc: 'delete a file' },
  { text: 'Test-Path config.json', category: 'powershell', difficulty: 1, desc: 'check whether a file exists' },
  { text: 'Stop-Process -Name notepad', category: 'powershell', difficulty: 1, desc: 'kill a process by name' },
  { text: 'Start-Service spooler', category: 'powershell', difficulty: 1, desc: 'start a stopped service' },
  { text: 'Get-Help Get-Item', category: 'powershell', difficulty: 1, desc: 'read the help page for a cmdlet' },
  // tier 2
  { text: 'Get-Process | Sort-Object CPU -Descending', category: 'powershell', difficulty: 2, desc: 'list processes by cpu time, hungriest first' },
  { text: 'Get-ChildItem -Recurse -Filter *.log', category: 'powershell', difficulty: 2, desc: 'find log files anywhere under this folder' },
  { text: "Get-Service | Where-Object Status -eq 'Running'", category: 'powershell', difficulty: 2, desc: 'show only services that are running' },
  { text: 'Get-Content error.log -Tail 20 -Wait', category: 'powershell', difficulty: 2, desc: 'follow the last lines of a log as it grows' },
  { text: 'Get-EventLog -LogName System -Newest 50', category: 'powershell', difficulty: 2, desc: 'show the 50 most recent system log events' },
  { text: 'Test-NetConnection example.com -Port 443', category: 'powershell', difficulty: 2, desc: 'check tcp connectivity to a host and port' },
  { text: 'Get-Help Get-Process -Examples', category: 'powershell', difficulty: 2, desc: 'show usage examples for a cmdlet' },
  { text: 'Measure-Command { npm run build }', category: 'powershell', difficulty: 2, desc: 'time how long a command takes to run' },
  { text: "Select-String -Path *.cs -Pattern 'TODO'", category: 'powershell', difficulty: 2, desc: 'grep source files for a pattern' },
  { text: 'Get-Process chrome | Stop-Process -Force', category: 'powershell', difficulty: 2, desc: 'force-kill every matching process' },
  { text: 'Restart-Service -Name W3SVC -Force', category: 'powershell', difficulty: 2, desc: 'restart iis even if dependents object' },
  { text: 'Get-NetIPAddress -AddressFamily IPv4', category: 'powershell', difficulty: 2, desc: 'list the ipv4 addresses on this machine' },
  { text: 'Compress-Archive -Path logs -DestinationPath logs.zip', category: 'powershell', difficulty: 2, desc: 'zip a folder from the shell' },
  { text: 'Invoke-WebRequest https://example.com -OutFile page.html', category: 'powershell', difficulty: 2, desc: 'download a url to a file' },
  { text: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', category: 'powershell', difficulty: 2, desc: 'allow local scripts to run for your user' },
  { text: 'Get-ChildItem | Measure-Object -Property Length -Sum', category: 'powershell', difficulty: 2, desc: 'total the size of files in a folder' },
  { text: 'Get-Process | Export-Csv procs.csv -NoTypeInformation', category: 'powershell', difficulty: 2, desc: 'dump the process list to a csv file' },
  // tier 3
  { text: 'Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }', category: 'powershell', difficulty: 3, desc: 'find files not touched in the last 30 days' },
  { text: 'Get-Process | Sort-Object WS -Descending | Select-Object -First 10 Name, Id, WS', category: 'powershell', difficulty: 3, desc: 'top 10 processes by working set memory' },
  { text: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=2} -MaxEvents 25", category: 'powershell', difficulty: 3, desc: 'the 25 most recent error-level system events' },
  { text: "Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -ne 'Running' }", category: 'powershell', difficulty: 3, desc: 'automatic services that failed to start' },
  { text: "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -File deploy.ps1'", category: 'powershell', difficulty: 3, desc: 'run a script in a new elevated shell' },
  { text: "Get-Content access.log | Select-String ' 500 ' | Measure-Object | Select-Object Count", category: 'powershell', difficulty: 3, desc: 'count http 500 responses in a log file' },
  { text: "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, FreeSpace", category: 'powershell', difficulty: 3, desc: 'free space per logical drive via cim' },
  { text: "Get-ChildItem *.txt | ForEach-Object { Rename-Item $_ ($_.Name -replace ' ', '_') }", category: 'powershell', difficulty: 3, desc: 'replace spaces with underscores in filenames' },
  { text: 'Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 5', category: 'powershell', difficulty: 3, desc: 'the five most recently installed updates' },
  { text: "Get-ScheduledTask | Where-Object State -eq 'Ready' | Select-Object TaskName, TaskPath", category: 'powershell', difficulty: 3, desc: 'scheduled tasks waiting for their trigger' },
  { text: 'Invoke-RestMethod https://api.github.com/repos/git/git | Select-Object stargazers_count', category: 'powershell', difficulty: 3, desc: 'call a json api and pick one field' },
  { text: 'Get-ChildItem C:\\Temp -Recurse -Include *.tmp | Remove-Item -Force -ErrorAction Ignore', category: 'powershell', difficulty: 3, desc: 'sweep temp files, ignoring locked ones' },
  { text: "Get-EventLog Application -EntryType Error -After (Get-Date).AddHours(-24) | Group Source", category: 'powershell', difficulty: 3, desc: 'group the last day of app errors by source' },
]
