import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // apt / apt-get
  { tool: 'apt', flag: '-y', desc: 'assume yes to all prompts', category: 'package-managers', difficulty: 1 },
  { tool: 'apt', flag: '--purge', desc: 'also remove configuration files when uninstalling', category: 'package-managers', difficulty: 2 },
  { tool: 'apt', flag: '--no-install-recommends', desc: 'skip recommended packages, install only hard dependencies', category: 'package-managers', difficulty: 2 },
  { tool: 'apt', flag: '--upgradable', desc: 'list only packages that have a newer version available', category: 'package-managers', difficulty: 2 },
  { tool: 'apt', flag: '--dry-run', desc: 'simulate the action without changing anything', category: 'package-managers', difficulty: 2 },
  { tool: 'apt-get', flag: '-y', desc: 'assume yes to all prompts', category: 'package-managers', difficulty: 1 },
  { tool: 'apt-get', flag: '--purge', desc: 'also remove configuration files when uninstalling', category: 'package-managers', difficulty: 2 },
  { tool: 'apt-get', flag: '--no-install-recommends', desc: 'skip recommended packages, install only hard dependencies', category: 'package-managers', difficulty: 2 },
  { tool: 'apt-get', flag: '-f', desc: 'fix broken dependencies', category: 'package-managers', difficulty: 2 },
  // dpkg / dpkg-query
  { tool: 'dpkg', flag: '-l', desc: 'list installed packages', category: 'package-managers', difficulty: 1 },
  { tool: 'dpkg', flag: '-L', desc: 'list files installed by a package', category: 'package-managers', difficulty: 2 },
  { tool: 'dpkg', flag: '-i', desc: 'install a local .deb package file', category: 'package-managers', difficulty: 1 },
  { tool: 'dpkg', flag: '-S', desc: 'find which package owns a file', category: 'package-managers', difficulty: 2 },
  { tool: 'dpkg', flag: '-r', desc: 'remove a package, keeping its config files', category: 'package-managers', difficulty: 2 },
  { tool: 'dpkg', flag: '-P', desc: 'purge a package including its config files', category: 'package-managers', difficulty: 3 },
  { tool: 'dpkg-query', flag: '-W', desc: 'show installed packages, optionally with a custom format', category: 'package-managers', difficulty: 3 },
  // rpm
  { tool: 'rpm', flag: '-qa', desc: 'query all installed packages', category: 'package-managers', difficulty: 1 },
  { tool: 'rpm', flag: '-qi', desc: 'show detailed information about an installed package', category: 'package-managers', difficulty: 2 },
  { tool: 'rpm', flag: '-ql', desc: 'list the files owned by an installed package', category: 'package-managers', difficulty: 2 },
  { tool: 'rpm', flag: '--qf', desc: 'custom query output format string', category: 'package-managers', difficulty: 3 },
  { tool: 'rpm', flag: '-e', desc: 'erase (uninstall) a package', category: 'package-managers', difficulty: 2 },
  { tool: 'rpm', flag: '-Uvh', desc: 'upgrade or install a package verbosely with a progress bar', category: 'package-managers', difficulty: 2 },
  // dnf
  { tool: 'dnf', flag: '-y', desc: 'assume yes to all prompts', category: 'package-managers', difficulty: 1 },
  { tool: 'dnf', flag: '--enablerepo', desc: 'temporarily enable the named repository', category: 'package-managers', difficulty: 2 },
  { tool: 'dnf', flag: '--refresh', desc: 'force refresh of repository metadata before the action', category: 'package-managers', difficulty: 2 },
  { tool: 'dnf', flag: '--best', desc: 'try to install the highest available package versions', category: 'package-managers', difficulty: 3 },
  // pacman
  { tool: 'pacman', flag: '-Syu', desc: 'sync repos and upgrade all installed packages', category: 'package-managers', difficulty: 1 },
  { tool: 'pacman', flag: '-S', desc: 'install packages from the repositories', category: 'package-managers', difficulty: 1 },
  { tool: 'pacman', flag: '-Ss', desc: 'search the repositories for a package', category: 'package-managers', difficulty: 1 },
  { tool: 'pacman', flag: '-Rns', desc: 'remove a package with its config and unneeded dependencies', category: 'package-managers', difficulty: 2 },
  { tool: 'pacman', flag: '-Qdt', desc: 'list orphaned dependencies no longer required', category: 'package-managers', difficulty: 3 },
  { tool: 'pacman', flag: '-Qqe', desc: 'quietly list explicitly installed package names', category: 'package-managers', difficulty: 3 },
  { tool: 'pacman', flag: '-Qi', desc: 'show detailed information about an installed package', category: 'package-managers', difficulty: 2 },
  { tool: 'pacman', flag: '-Sc', desc: 'clean the package cache of uninstalled versions', category: 'package-managers', difficulty: 2 },
  { tool: 'pacman', flag: '--needed', desc: 'skip packages that are already up to date', category: 'package-managers', difficulty: 2 },
  { tool: 'pacman', flag: '--noconfirm', desc: 'never ask for confirmation', category: 'package-managers', difficulty: 2 },
  // brew
  { tool: 'brew', flag: '--greedy', desc: 'also upgrade casks that auto-update themselves', category: 'package-managers', difficulty: 3 },
  { tool: 'brew', flag: '--json', desc: 'output machine-readable json', category: 'package-managers', difficulty: 2 },
  { tool: 'brew', flag: '--describe', desc: 'include a description comment for each brewfile entry', category: 'package-managers', difficulty: 3 },
  { tool: 'brew', flag: '--file', desc: 'path of the brewfile to read or write', category: 'package-managers', difficulty: 2 },
  { tool: 'brew', flag: '--force', desc: 'overwrite an existing file or force the operation', category: 'package-managers', difficulty: 2 },
  { tool: 'brew', flag: '--cask', desc: 'operate on gui app casks instead of formulae', category: 'package-managers', difficulty: 1 },
  // flatpak
  { tool: 'flatpak', flag: '--if-not-exists', desc: 'add the remote only if it is not already configured', category: 'package-managers', difficulty: 3 },
  { tool: 'flatpak', flag: '--user', desc: 'operate on the per-user installation instead of system-wide', category: 'package-managers', difficulty: 2 },
  // helper tools used in package-manager pipelines
  { tool: 'grep', flag: '-i', desc: 'case-insensitive match', category: 'package-managers', difficulty: 1 },
  { tool: 'grep', flag: '-v', desc: 'invert the match: keep non-matching lines', category: 'package-managers', difficulty: 1 },
  { tool: 'grep', flag: '-E', desc: 'use extended regular expressions', category: 'package-managers', difficulty: 2 },
  { tool: 'head', flag: '-n', desc: 'show only the first n lines', category: 'package-managers', difficulty: 1 },
  { tool: 'sort', flag: '-rn', desc: 'numeric sort in reverse (largest first)', category: 'package-managers', difficulty: 2 },
  { tool: 'sort', flag: '-k2', desc: 'sort by the second field', category: 'package-managers', difficulty: 2 },
  { tool: 'sort', flag: '-n', desc: 'sort numerically instead of lexically', category: 'package-managers', difficulty: 1 },
  { tool: 'cut', flag: '-d/', desc: 'use "/" as the field delimiter', category: 'package-managers', difficulty: 2 },
  { tool: 'cut', flag: '-f1', desc: 'select the first field', category: 'package-managers', difficulty: 2 },
  { tool: 'jq', flag: '-r', desc: 'output raw strings without json quotes', category: 'package-managers', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  // "-Qtdq)" is a token mangled by the surrounding $( ) command substitution
  'sudo pacman -Rns $(pacman -Qtdq) && sudo pacman -Sc --noconfirm :: -Qtdq)',
  // the second -r belongs to xargs, whose segment has no tool word to attach to
  "brew outdated --json | jq -r '.formulae[].name' | xargs -r brew upgrade :: -r",
]
