/**
 * Which upstream sources feed each category.
 * - tldr: page basenames (without .md) or prefix matchers like 'git-*',
 *   searched across pages/{common,linux,osx,windows}.
 * - fig: spec module names in @withfig/autocomplete/build.
 * This file is routing configuration, not content — all command text and
 * descriptions come from the upstream packages.
 */
export const CATEGORY_SOURCES = {
  bash: {
    tldr: [
      'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'touch', 'head',
      'tail', 'which', 'echo', 'df', 'du', 'history', 'find', 'chmod', 'chown',
      'ps', 'kill', 'pgrep', 'pkill', 'ln', 'wc', 'diff', 'xargs', 'watch',
      'free', 'lsof', 'nohup', 'alias', 'export', 'date', 'uname', 'whoami',
      'tree', 'uptime', 'env', 'basename', 'dirname', 'tee', 'seq', 'less',
      'rsync', 'dd', 'time', 'crontab', 'top', 'htop',
    ],
    fig: [
      'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'touch', 'head', 'tail', 'df',
      'du', 'find', 'chmod', 'chown', 'ps', 'kill', 'ln', 'wc', 'diff',
      'xargs', 'watch', 'lsof', 'date', 'tree', 'tee', 'less', 'rsync', 'dd',
      'crontab', 'top',
    ],
  },
  git: {
    tldr: ['git', 'git-*'],
    fig: ['git'],
  },
  docker: {
    tldr: ['docker', 'docker-*'],
    fig: ['docker'],
  },
  podman: {
    tldr: ['podman', 'podman-*'],
    fig: ['podman'],
  },
  kubernetes: {
    tldr: ['kubectl', 'kubectl-*', 'helm', 'helm-*', 'minikube', 'k9s', 'kind'],
    fig: ['kubectl', 'helm', 'minikube', 'kind'],
  },
  npm: {
    tldr: ['npm', 'npm-*', 'npx', 'node', 'yarn', 'pnpm', 'corepack', 'bun'],
    fig: ['npm', 'npx', 'node', 'yarn', 'pnpm', 'bun'],
  },
  powershell: {
    dirs: ['windows'],
    tldr: [
      'get-childitem', 'get-process', 'get-content', 'get-service',
      'get-command', 'get-help', 'get-date', 'get-location', 'get-alias',
      'get-clipboard', 'set-location', 'copy-item', 'move-item', 'remove-item',
      'new-item', 'test-connection', 'select-string', 'select-object',
      'sort-object', 'where-object', 'foreach-object', 'start-process',
      'stop-process', 'start-service', 'stop-service', 'restart-service',
      'test-path', 'invoke-webrequest', 'measure-object', 'out-file',
      'get-member', 'set-content', 'add-content', 'rename-item', 'clear-host',
    ],
    fig: [],
  },
  cmd: {
    dirs: ['windows'],
    tldr: [
      'dir', 'copy', 'xcopy', 'robocopy', 'del', 'move', 'ren', 'type',
      'ipconfig', 'tasklist', 'taskkill', 'sfc', 'chkdsk', 'reg', 'findstr',
      'where', 'systeminfo', 'shutdown', 'attrib', 'fc', 'net', 'wmic',
      'powercfg', 'schtasks', 'netstat', 'ping', 'tracert', 'assoc', 'call',
      'chcp', 'cls', 'cmd', 'color', 'comp', 'driverquery', 'exit', 'for',
      'ftype', 'getmac', 'hostname', 'label', 'makecab', 'mklink', 'mode',
      'more', 'mountvol', 'pathping', 'pause', 'set', 'start', 'timeout',
      'title', 'tzutil', 'ver', 'vol', 'w32tm', 'winget',
    ],
    fig: ['winget'],
  },
  'ssh-network': {
    tldr: [
      'ssh', 'scp', 'sftp', 'ssh-keygen', 'ssh-copy-id', 'ssh-add', 'curl',
      'wget', 'ping', 'dig', 'nslookup', 'traceroute', 'mtr', 'netstat', 'ss',
      'ip', 'ifconfig', 'nmap', 'nc', 'telnet', 'openssl', 'whois', 'host',
      'arp', 'iptables', 'ufw', 'tcpdump', 'hostname',
    ],
    fig: [
      'ssh', 'scp', 'sftp', 'ssh-keygen', 'ssh-copy-id', 'curl', 'wget',
      'ping', 'dig', 'traceroute', 'netstat', 'ip', 'nmap', 'nc', 'openssl',
      'whois', 'ufw', 'tcpdump',
    ],
  },
  vim: {
    tldr: ['vim', 'nvim', 'vimdiff', 'view', 'vimtutor', 'ex'],
    fig: ['vim', 'nvim'],
  },
  systemd: {
    tldr: [
      'systemctl', 'journalctl', 'timedatectl', 'hostnamectl', 'loginctl',
      'systemd-analyze', 'localectl', 'resolvectl', 'networkctl', 'coredumpctl',
    ],
    fig: ['systemctl'],
  },
  archives: {
    tldr: [
      'tar', 'zip', 'unzip', 'gzip', 'gunzip', 'bzip2', 'xz', 'zstd', '7z',
      '7za', 'unrar', 'split', 'zcat', 'ar', 'cpio',
    ],
    fig: ['tar', 'zip', 'unzip', 'gzip', 'xz'],
  },
  'text-tools': {
    tldr: [
      'grep', 'rg', 'sed', 'awk', 'jq', 'yq', 'cut', 'sort', 'uniq', 'tr',
      'paste', 'column', 'fmt', 'nl', 'rev', 'shuf', 'comm', 'join',
      'strings', 'fold', 'diff3', 'expand',
    ],
    fig: ['grep', 'rg', 'sed', 'jq', 'cut', 'sort', 'uniq', 'tr', 'column'],
  },
  'package-managers': {
    tldr: [
      'apt', 'apt-get', 'apt-cache', 'dpkg', 'dnf', 'yum', 'rpm', 'pacman',
      'yay', 'brew', 'snap', 'flatpak', 'zypper', 'apk', 'nix', 'port',
    ],
    fig: ['apt', 'apt-get', 'dnf', 'yum', 'rpm', 'brew', 'snap', 'nix'],
  },
  cloud: {
    tldr: [
      'aws', 'aws-*', 'gcloud', 'az', 'az-*', 'terraform', 'gh', 'gh-*',
      'doctl', 'flyctl', 'vercel', 'netlify', 'pulumi', 'wrangler',
    ],
    fig: ['aws', 'gcloud', 'terraform', 'gh', 'doctl', 'vercel', 'netlify', 'pulumi'],
  },
}

/** category-aware fillers for tldr {{placeholders}}, most specific first */
export const PLACEHOLDER_RULES = [
  [/^(path\/to\/)?(source|src)_?(file|archive)?\d*(\.\w+)?$/i, 'src.txt'],
  [/^(path\/to\/)?(target|dest|destination|output)_?(file|archive|directory)?\d*(\.(\w+))?$/i, (m) => (m[5] ? `out.${m[5]}` : 'out')],
  [/(directory|folder)\d*\/?$/i, 'my-project'],
  [/^(path\/to\/)?file(name)?\d*\.(\w+)$/i, (m) => `file.${m[3]}`],
  [/^(path\/to\/)?file(name)?\d*$/i, 'notes.txt'],
  [/\.(tar\.gz|tgz)$/i, 'backup.tar.gz'],
  [/\.tar$/i, 'backup.tar'],
  [/\.zip$/i, 'archive.zip'],
  [/\.(\w{1,5})\d*$/i, (m, p) => p.split('/').pop()],
  [/^(container|container_name|container_id)$/i, 'web'],
  [/^(image|image_name|image_id)(:tag)?$/i, 'nginx'],
  [/^tag(_?name)?$/i, 'v1.2.0'],
  [/^branch(_?name)?\d*$/i, 'main'],
  [/^remote(_?name)?$/i, 'origin'],
  [/^(commit|commit_?hash|hash|sha|ref|revision)\d*$/i, 'a1b2c3d'],
  [/^(message|commit_message)$/i, 'update readme'],
  [/^url$/i, 'https://example.com'],
  [/^link(_?name)?$/i, 'mylink'],
  [/^address$/i, 'example.com'],
  [/^(user|username|owner)(name)?$/i, 'admin'],
  [/^group(_?name)?$/i, 'staff'],
  [/(arguments?_source|input_source)$/i, 'cat items.txt'],
  [/^(host|hostname|server|remote_host)$/i, 'example.com'],
  [/^(ip|ip_address)$/i, '10.0.0.5'],
  [/^port(_?number)?$/i, '8080'],
  [/^(package|package_name|formula|module|dependency)\d*$/i, 'htop'],
  [/^(pattern|search_pattern|regex|regular_expression|search_?(string|term)?)$/i, 'error'],
  [/^(replacement|replace_?string)$/i, 'fixed'],
  [/^(number|count|n|num|lines|line_number|depth|level)$/i, '10'],
  [/^(pid|process_id)$/i, '1234'],
  [/^(process|process_name|program|task_name)$/i, 'nginx'],
  [/^(seconds|minutes|duration|interval|timeout)$/i, '5'],
  [/^(service|service_name)$/i, 'nginx'],
  [/^unit\d*(\.service)?$/i, 'nginx.service'],
  [/^(pod|pod_name)$/i, 'web-0'],
  [/^(namespace|namespace_name)$/i, 'prod'],
  [/^(deployment|deployment_name)$/i, 'api'],
  [/^(node|node_name)$/i, 'node-1'],
  [/^(cluster|cluster_name|context)$/i, 'prod-cluster'],
  [/^(release|release_name|chart)$/i, 'my-app'],
  [/^(bucket|bucket_name)$/i, 'my-bucket'],
  [/^(region|zone)$/i, 'us-east-1'],
  [/^(profile|profile_name)$/i, 'default'],
  [/^(repository|repo)(_?name)?$/i, 'my-repo'],
  [/^(database|db|database_name)$/i, 'appdb'],
  [/^(table|table_name)$/i, 'users'],
  [/^(key|key_?file|identity_file|private_?key)$/i, 'id_ed25519'],
  [/^(variable|var|env_var|name=value)$/i, 'DEBUG=1'],
  [/^(value|string|text|word)\d*$/i, 'hello'],
  [/^(name|alias|title|label|id)\d*$/i, 'demo'],
  [/^(command|program|program_name)$/i, 'date'],
  [/^(subcommand|script)$/i, 'status'],
  [/^(drive|drive_letter)(:)?$/i, 'C:'],
  [/^(extension|ext)$/i, 'txt'],
  [/^(query|expression|filter)$/i, '.items'],
  [/^(version|version_number)$/i, '1.2.0'],
]
