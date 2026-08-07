import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const cmd: CommandEntry[] = [
  // tier 1
  { text: 'dir', category: 'cmd', difficulty: 1, desc: 'list files in the current directory' },
  { text: 'cls', category: 'cmd', difficulty: 1, desc: 'clear the console window' },
  { text: 'cd ..', category: 'cmd', difficulty: 1, desc: 'move up one directory' },
  { text: 'ipconfig', category: 'cmd', difficulty: 1, desc: 'show basic network adapter settings' },
  { text: 'hostname', category: 'cmd', difficulty: 1, desc: 'print the name of this computer' },
  { text: 'whoami', category: 'cmd', difficulty: 1, desc: 'show the current user account' },
  { text: 'ver', category: 'cmd', difficulty: 1, desc: 'print the windows version' },
  { text: 'tasklist', category: 'cmd', difficulty: 1, desc: 'list running processes' },
  { text: 'ping 8.8.8.8', category: 'cmd', difficulty: 1, desc: 'test connectivity to a public dns server' },
  { text: 'mkdir builds', category: 'cmd', difficulty: 1, desc: 'create a new directory' },
  { text: 'del temp.txt', category: 'cmd', difficulty: 1, desc: 'delete a file' },
  { text: 'copy a.txt b.txt', category: 'cmd', difficulty: 1, desc: 'copy a file to a new name' },
  { text: 'type readme.txt', category: 'cmd', difficulty: 1, desc: 'print the contents of a text file' },
  { text: 'echo %PATH%', category: 'cmd', difficulty: 1, desc: 'print the executable search path' },
  { text: 'date /t', category: 'cmd', difficulty: 1, desc: 'show the current date without prompting' },
  { text: 'time /t', category: 'cmd', difficulty: 1, desc: 'show the current time without prompting' },
  { text: 'systeminfo', category: 'cmd', difficulty: 1, desc: 'dump os, hardware, and patch details' },
  // tier 2
  { text: 'dir /s /b *.log', category: 'cmd', difficulty: 2, desc: 'recursively list log files, bare paths only' },
  { text: 'xcopy src dest /e /i /y', category: 'cmd', difficulty: 2, desc: 'copy a tree including empty dirs, no prompts' },
  { text: 'ipconfig /all', category: 'cmd', difficulty: 2, desc: 'full adapter details including mac and dns' },
  { text: 'ipconfig /flushdns', category: 'cmd', difficulty: 2, desc: 'clear the local dns resolver cache' },
  { text: 'tasklist /fi "imagename eq chrome.exe"', category: 'cmd', difficulty: 2, desc: 'list only processes matching a name' },
  { text: 'taskkill /im notepad.exe /f', category: 'cmd', difficulty: 2, desc: 'force-kill a process by image name' },
  { text: 'netstat -ano | findstr :8080', category: 'cmd', difficulty: 2, desc: 'find which pid is bound to a port' },
  { text: 'sfc /scannow', category: 'cmd', difficulty: 2, desc: 'scan and repair protected system files' },
  { text: 'chkdsk C: /f', category: 'cmd', difficulty: 2, desc: 'schedule a disk check that fixes errors' },
  { text: 'attrib +r config.ini', category: 'cmd', difficulty: 2, desc: 'mark a file read-only' },
  { text: 'findstr /s /i "error" *.log', category: 'cmd', difficulty: 2, desc: 'case-insensitive search across log files' },
  { text: 'fc /n old.txt new.txt', category: 'cmd', difficulty: 2, desc: 'compare two files with line numbers' },
  { text: 'schtasks /query /fo list', category: 'cmd', difficulty: 2, desc: 'list scheduled tasks in list format' },
  { text: 'shutdown /r /t 60', category: 'cmd', difficulty: 2, desc: 'reboot the machine after a 60 second delay' },
  { text: 'where python', category: 'cmd', difficulty: 2, desc: 'show every match for a command on the path' },
  { text: 'set PATH=%PATH%;C:\\tools', category: 'cmd', difficulty: 2, desc: 'append a folder to the path for this session' },
  { text: 'net user', category: 'cmd', difficulty: 2, desc: 'list local user accounts' },
  // tier 3
  { text: 'robocopy C:\\Users\\me\\docs D:\\backup\\docs /MIR /R:3 /W:5 /LOG:backup.log', category: 'cmd', difficulty: 3, desc: 'mirror a folder with retries and a log file' },
  { text: 'reg add "HKCU\\Software\\MyApp" /v Version /t REG_SZ /d "2.1.0" /f', category: 'cmd', difficulty: 3, desc: 'write a registry string value without prompting' },
  { text: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName', category: 'cmd', difficulty: 3, desc: 'read the windows edition from the registry' },
  { text: 'netsh advfirewall firewall add rule name="Web" dir=in action=allow localport=80', category: 'cmd', difficulty: 3, desc: 'open inbound port 80 in the firewall' },
  { text: 'netsh wlan show profile name="HomeWifi" key=clear', category: 'cmd', difficulty: 3, desc: 'reveal a saved wifi password' },
  { text: "wmic process where \"name='chrome.exe'\" get processid,workingsetsize", category: 'cmd', difficulty: 3, desc: 'memory usage per chrome process via wmic' },
  { text: "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :443') do @echo %a", category: 'cmd', difficulty: 3, desc: 'extract the pid holding port 443 in a loop' },
  { text: 'dism /online /cleanup-image /restorehealth', category: 'cmd', difficulty: 3, desc: 'repair the component store from windows update' },
  { text: 'powercfg /batteryreport /output battery.html', category: 'cmd', difficulty: 3, desc: 'generate an html battery health report' },
  { text: 'forfiles /p C:\\logs /s /m *.log /d -30 /c "cmd /c del @path"', category: 'cmd', difficulty: 3, desc: 'delete log files older than 30 days' },
  { text: 'certutil -hashfile installer.exe SHA256', category: 'cmd', difficulty: 3, desc: 'compute a sha256 checksum of a download' },
  { text: 'wevtutil qe System /c:20 /rd:true /f:text', category: 'cmd', difficulty: 3, desc: 'print the 20 newest system events as text' },
  { text: 'takeown /f C:\\locked /r /d y', category: 'cmd', difficulty: 3, desc: 'take ownership of a folder tree' },
]
