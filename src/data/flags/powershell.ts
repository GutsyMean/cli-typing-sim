import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // Get-ChildItem
  { tool: 'Get-ChildItem', flag: '-Recurse', desc: 'include items in all subdirectories', category: 'powershell', difficulty: 1 },
  { tool: 'Get-ChildItem', flag: '-Filter', desc: 'filter items by a wildcard pattern at the provider level', category: 'powershell', difficulty: 1 },
  { tool: 'Get-ChildItem', flag: '-Include', desc: 'include only items matching the given patterns', category: 'powershell', difficulty: 2 },
  { tool: 'Get-ChildItem', flag: '-File', desc: 'list files only, no directories', category: 'powershell', difficulty: 2 },
  { tool: 'Get-ChildItem', flag: '-Directory', desc: 'list directories only, no files', category: 'powershell', difficulty: 2 },
  { tool: 'Get-ChildItem', flag: '-Hidden', desc: 'show only hidden items', category: 'powershell', difficulty: 3 },
  // Process cmdlets
  { tool: 'Stop-Process', flag: '-Name', desc: 'stop processes by name instead of id', category: 'powershell', difficulty: 1 },
  { tool: 'Stop-Process', flag: '-Force', desc: 'stop the process without prompting for confirmation', category: 'powershell', difficulty: 1 },
  { tool: 'Get-Process', flag: '-Id', desc: 'get the process with the given process id', category: 'powershell', difficulty: 2 },
  { tool: 'Start-Process', flag: '-Verb', desc: 'launch with a verb such as runas for elevation', category: 'powershell', difficulty: 2 },
  { tool: 'Start-Process', flag: '-ArgumentList', desc: 'arguments to pass to the started process', category: 'powershell', difficulty: 2 },
  { tool: 'Start-Process', flag: '-Wait', desc: 'wait for the started process to exit', category: 'powershell', difficulty: 2 },
  // Pipeline / object cmdlets
  { tool: 'Sort-Object', flag: '-Descending', desc: 'sort from highest to lowest', category: 'powershell', difficulty: 1 },
  { tool: 'Sort-Object', flag: '-Unique', desc: 'drop duplicate values after sorting', category: 'powershell', difficulty: 2 },
  { tool: 'Select-Object', flag: '-First', desc: 'take only the first n objects', category: 'powershell', difficulty: 1 },
  { tool: 'Select-Object', flag: '-Last', desc: 'take only the last n objects', category: 'powershell', difficulty: 2 },
  { tool: 'Select-Object', flag: '-ExpandProperty', desc: 'output the raw value of a single property', category: 'powershell', difficulty: 2 },
  { tool: 'Measure-Object', flag: '-Property', desc: 'property of the input objects to measure', category: 'powershell', difficulty: 2 },
  { tool: 'Measure-Object', flag: '-Sum', desc: 'compute the sum of the measured property', category: 'powershell', difficulty: 2 },
  { tool: 'Measure-Object', flag: '-Average', desc: 'compute the average of the measured property', category: 'powershell', difficulty: 2 },
  // Where-Object comparison operators
  { tool: 'Where-Object', flag: '-eq', desc: 'comparison operator: equals', category: 'powershell', difficulty: 1 },
  { tool: 'Where-Object', flag: '-ne', desc: 'comparison operator: not equal', category: 'powershell', difficulty: 1 },
  { tool: 'Where-Object', flag: '-lt', desc: 'comparison operator: less than', category: 'powershell', difficulty: 1 },
  { tool: 'Where-Object', flag: '-gt', desc: 'comparison operator: greater than', category: 'powershell', difficulty: 1 },
  { tool: 'Where-Object', flag: '-like', desc: 'comparison operator: wildcard match', category: 'powershell', difficulty: 2 },
  { tool: 'Where-Object', flag: '-match', desc: 'comparison operator: regex match', category: 'powershell', difficulty: 2 },
  { tool: 'Where-Object', flag: '-and', desc: 'logical operator: both conditions must be true', category: 'powershell', difficulty: 1 },
  { tool: 'ForEach-Object', flag: '-replace', desc: 'regex replace operator: swap matching text for a replacement', category: 'powershell', difficulty: 2 },
  // Content cmdlets
  { tool: 'Get-Content', flag: '-Tail', desc: 'read only the last n lines of the file', category: 'powershell', difficulty: 1 },
  { tool: 'Get-Content', flag: '-Wait', desc: 'keep the file open and stream new lines as they arrive', category: 'powershell', difficulty: 2 },
  { tool: 'Get-Content', flag: '-Raw', desc: 'read the whole file as a single string', category: 'powershell', difficulty: 2 },
  { tool: 'Select-String', flag: '-Path', desc: 'files to search for the pattern', category: 'powershell', difficulty: 1 },
  { tool: 'Select-String', flag: '-Pattern', desc: 'regex pattern to search for', category: 'powershell', difficulty: 1 },
  { tool: 'Select-String', flag: '-CaseSensitive', desc: 'make the pattern match case-sensitively', category: 'powershell', difficulty: 2 },
  // Event logs
  { tool: 'Get-EventLog', flag: '-LogName', desc: 'name of the event log to read', category: 'powershell', difficulty: 2 },
  { tool: 'Get-EventLog', flag: '-Newest', desc: 'return only the newest n entries', category: 'powershell', difficulty: 2 },
  { tool: 'Get-EventLog', flag: '-EntryType', desc: 'filter entries by type such as error or warning', category: 'powershell', difficulty: 2 },
  { tool: 'Get-EventLog', flag: '-After', desc: 'return only entries after the given date and time', category: 'powershell', difficulty: 2 },
  { tool: 'Get-WinEvent', flag: '-FilterHashtable', desc: 'filter events with a hashtable of log name, level, and more', category: 'powershell', difficulty: 3 },
  { tool: 'Get-WinEvent', flag: '-MaxEvents', desc: 'maximum number of events to return', category: 'powershell', difficulty: 2 },
  // Services
  { tool: 'Restart-Service', flag: '-Name', desc: 'service name to restart', category: 'powershell', difficulty: 1 },
  { tool: 'Restart-Service', flag: '-Force', desc: 'restart even if the service has dependent services', category: 'powershell', difficulty: 2 },
  // Network
  { tool: 'Test-NetConnection', flag: '-Port', desc: 'tcp port to test connectivity against', category: 'powershell', difficulty: 1 },
  { tool: 'Test-Connection', flag: '-Count', desc: 'number of echo requests to send', category: 'powershell', difficulty: 2 },
  { tool: 'Get-NetIPAddress', flag: '-AddressFamily', desc: 'limit results to ipv4 or ipv6 addresses', category: 'powershell', difficulty: 2 },
  // Files / archive / web
  { tool: 'Remove-Item', flag: '-Force', desc: 'delete hidden and read-only items without prompting', category: 'powershell', difficulty: 1 },
  { tool: 'Remove-Item', flag: '-ErrorAction', desc: 'how to respond to errors, e.g. ignore or stop', category: 'powershell', difficulty: 2 },
  { tool: 'Copy-Item', flag: '-Recurse', desc: 'copy a directory and all of its contents', category: 'powershell', difficulty: 1 },
  { tool: 'New-Item', flag: '-ItemType', desc: 'kind of item to create, such as file or directory', category: 'powershell', difficulty: 2 },
  { tool: 'Compress-Archive', flag: '-Path', desc: 'files or folders to add to the archive', category: 'powershell', difficulty: 1 },
  { tool: 'Compress-Archive', flag: '-DestinationPath', desc: 'path of the zip archive to create', category: 'powershell', difficulty: 1 },
  { tool: 'Invoke-WebRequest', flag: '-OutFile', desc: 'save the response body to a file', category: 'powershell', difficulty: 1 },
  { tool: 'Invoke-RestMethod', flag: '-Method', desc: 'http method to use, such as get or post', category: 'powershell', difficulty: 2 },
  // Export / formatting
  { tool: 'Export-Csv', flag: '-NoTypeInformation', desc: 'omit the type header line from the csv output', category: 'powershell', difficulty: 2 },
  { tool: 'Format-Table', flag: '-AutoSize', desc: 'size columns to fit their content', category: 'powershell', difficulty: 2 },
  { tool: 'ConvertTo-Json', flag: '-Depth', desc: 'how many levels of nested objects to serialize', category: 'powershell', difficulty: 2 },
  // Help / policy
  { tool: 'Get-Help', flag: '-Examples', desc: 'show only the examples section of the help', category: 'powershell', difficulty: 1 },
  { tool: 'Get-Help', flag: '-Full', desc: 'show the complete help including parameter details', category: 'powershell', difficulty: 2 },
  { tool: 'Set-ExecutionPolicy', flag: '-Scope', desc: 'which scope the policy applies to, e.g. currentuser', category: 'powershell', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
