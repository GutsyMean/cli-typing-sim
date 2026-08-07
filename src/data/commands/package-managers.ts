import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const packageManagers: CommandEntry[] = [
  // tier 1
  { text: 'sudo apt update', category: 'package-managers', difficulty: 1, desc: 'refresh the apt package index' },
  { text: 'sudo apt install curl', category: 'package-managers', difficulty: 1, desc: 'install a package with apt' },
  { text: 'sudo apt remove nano', category: 'package-managers', difficulty: 1, desc: 'uninstall a package with apt' },
  { text: 'apt search ripgrep', category: 'package-managers', difficulty: 1, desc: 'search apt repositories by name' },
  { text: 'sudo apt-get install -y jq', category: 'package-managers', difficulty: 1, desc: 'install without an interactive prompt' },
  { text: 'dpkg -l', category: 'package-managers', difficulty: 1, desc: 'list every installed debian package' },
  { text: 'sudo dnf install git', category: 'package-managers', difficulty: 1, desc: 'install a package with dnf' },
  { text: 'sudo dnf upgrade', category: 'package-managers', difficulty: 1, desc: 'upgrade all packages on a fedora system' },
  { text: 'sudo yum install wget', category: 'package-managers', difficulty: 1, desc: 'install a package with yum' },
  { text: 'rpm -qa', category: 'package-managers', difficulty: 1, desc: 'list all installed rpm packages' },
  { text: 'sudo pacman -Syu', category: 'package-managers', difficulty: 1, desc: 'sync and upgrade an arch system' },
  { text: 'pacman -Ss neovim', category: 'package-managers', difficulty: 1, desc: 'search the arch repositories' },
  { text: 'brew install jq', category: 'package-managers', difficulty: 1, desc: 'install a formula with homebrew' },
  { text: 'brew update', category: 'package-managers', difficulty: 1, desc: 'refresh homebrew and its formulae' },
  { text: 'sudo snap install htop', category: 'package-managers', difficulty: 1, desc: 'install a snap package' },
  { text: 'snap list', category: 'package-managers', difficulty: 1, desc: 'list installed snaps' },
  { text: 'flatpak list', category: 'package-managers', difficulty: 1, desc: 'list installed flatpak apps' },
  // tier 2
  { text: 'sudo apt install --no-install-recommends nginx', category: 'package-managers', difficulty: 2, desc: 'install a package without its optional extras' },
  { text: 'sudo apt-get autoremove --purge -y', category: 'package-managers', difficulty: 2, desc: 'remove orphaned packages and their configs' },
  { text: 'apt policy docker-ce', category: 'package-managers', difficulty: 2, desc: 'show installed and candidate versions' },
  { text: 'sudo apt full-upgrade -y', category: 'package-managers', difficulty: 2, desc: 'upgrade, allowing removals when needed' },
  { text: 'dpkg -L nginx', category: 'package-managers', difficulty: 2, desc: 'list the files a package installed' },
  { text: 'sudo dpkg -i code_1.92.0_amd64.deb', category: 'package-managers', difficulty: 2, desc: 'install a downloaded .deb file' },
  { text: 'dpkg -S /usr/bin/python3', category: 'package-managers', difficulty: 2, desc: 'find which package owns a file' },
  { text: 'sudo dnf install -y epel-release', category: 'package-managers', difficulty: 2, desc: 'enable the extra packages repository' },
  { text: 'dnf list installed | grep kernel', category: 'package-managers', difficulty: 2, desc: 'show installed kernel packages' },
  { text: 'sudo dnf history undo last', category: 'package-managers', difficulty: 2, desc: 'roll back the most recent transaction' },
  { text: 'rpm -qi openssl', category: 'package-managers', difficulty: 2, desc: 'show detailed info about a package' },
  { text: 'rpm -ql coreutils | head', category: 'package-managers', difficulty: 2, desc: 'peek at the files a package provides' },
  { text: 'sudo pacman -Rns firefox', category: 'package-managers', difficulty: 2, desc: 'remove a package with its deps and configs' },
  { text: 'sudo pacman -S --needed base-devel git', category: 'package-managers', difficulty: 2, desc: 'install build tools, skipping ones present' },
  { text: 'pacman -Qdt', category: 'package-managers', difficulty: 2, desc: 'list orphaned dependency packages' },
  { text: 'brew upgrade --greedy', category: 'package-managers', difficulty: 2, desc: 'upgrade everything, including pinned casks' },
  { text: 'brew services start redis', category: 'package-managers', difficulty: 2, desc: 'run a formula as a background service' },
  { text: 'flatpak install flathub org.gimp.GIMP', category: 'package-managers', difficulty: 2, desc: 'install an app from the flathub remote' },
  { text: 'sudo yum groupinstall "Development Tools"', category: 'package-managers', difficulty: 2, desc: 'install a whole toolchain group at once' },
  // tier 3
  { text: 'sudo apt update && sudo apt upgrade -y && sudo apt autoremove --purge -y', category: 'package-managers', difficulty: 3, desc: 'full maintenance pass: refresh, upgrade, clean up' },
  { text: 'dpkg -l | awk \'/^ii/ {print $2}\' | grep -i python > python-packages.txt', category: 'package-managers', difficulty: 3, desc: 'save a list of every installed python package' },
  { text: 'sudo apt-get install -y --no-install-recommends build-essential libssl-dev', category: 'package-managers', difficulty: 3, desc: 'minimal compiler toolchain for building from source' },
  { text: 'apt list --upgradable 2>/dev/null | grep -v Listing | cut -d/ -f1', category: 'package-managers', difficulty: 3, desc: 'clean list of package names with pending upgrades' },
  { text: 'sudo dnf --enablerepo=updates-testing upgrade --refresh -y kernel', category: 'package-managers', difficulty: 3, desc: 'pull a kernel update from the testing repo' },
  { text: 'rpm -qa --qf \'%{NAME} %{SIZE}\\n\' | sort -rn -k2 | head -n 20', category: 'package-managers', difficulty: 3, desc: 'the 20 largest installed rpm packages' },
  { text: 'pacman -Qqe > pkglist.txt && sudo pacman -S --needed - < pkglist.txt', category: 'package-managers', difficulty: 3, desc: 'export explicit packages and reinstall from the list' },
  { text: 'sudo pacman -Rns $(pacman -Qtdq) && sudo pacman -Sc --noconfirm', category: 'package-managers', difficulty: 3, desc: 'purge orphans, then trim the package cache' },
  { text: 'brew outdated --json | jq -r \'.formulae[].name\' | xargs -r brew upgrade', category: 'package-managers', difficulty: 3, desc: 'upgrade exactly the formulae that are outdated' },
  { text: 'brew bundle dump --describe --file=~/dotfiles/Brewfile --force', category: 'package-managers', difficulty: 3, desc: 'snapshot everything installed into a brewfile' },
  { text: 'sudo snap set system refresh.timer=fri5,23:00-01:00', category: 'package-managers', difficulty: 3, desc: 'pin snap auto-refresh to a late-night window' },
  { text: 'flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo', category: 'package-managers', difficulty: 3, desc: 'add the flathub remote, idempotently' },
  { text: 'dpkg-query -W -f=\'${Installed-Size}\\t${Package}\\n\' | sort -rn | head -n 15', category: 'package-managers', difficulty: 3, desc: 'the 15 biggest installed debian packages' },
  { text: 'sudo dnf history info last | grep -E \'Install|Upgrade\' | head -n 20', category: 'package-managers', difficulty: 3, desc: 'what the last dnf transaction actually changed' },
]
