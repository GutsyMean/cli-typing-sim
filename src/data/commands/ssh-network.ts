import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const sshNetwork: CommandEntry[] = [
  // tier 1
  { text: 'ssh user@server', category: 'ssh-network', difficulty: 1, desc: 'open a shell on a remote host' },
  { text: 'ping -c 4 8.8.8.8', category: 'ssh-network', difficulty: 1, desc: 'send four pings to a public dns server' },
  { text: 'curl https://example.com', category: 'ssh-network', difficulty: 1, desc: 'fetch a url and print the body' },
  { text: 'curl -I https://example.com', category: 'ssh-network', difficulty: 1, desc: 'fetch only the response headers' },
  { text: 'wget https://example.com/file.zip', category: 'ssh-network', difficulty: 1, desc: 'download a file to the current directory' },
  { text: 'dig example.com', category: 'ssh-network', difficulty: 1, desc: 'look up the a record for a domain' },
  { text: 'nslookup example.com', category: 'ssh-network', difficulty: 1, desc: 'resolve a hostname to an ip address' },
  { text: 'traceroute 8.8.8.8', category: 'ssh-network', difficulty: 1, desc: 'show each hop on the way to a host' },
  { text: 'host example.com', category: 'ssh-network', difficulty: 1, desc: 'quick dns lookup for a domain' },
  { text: 'ip addr', category: 'ssh-network', difficulty: 1, desc: 'list network interfaces and addresses' },
  { text: 'ip route', category: 'ssh-network', difficulty: 1, desc: 'show the kernel routing table' },
  { text: 'ss -t', category: 'ssh-network', difficulty: 1, desc: 'list established tcp connections' },
  { text: 'netstat -an', category: 'ssh-network', difficulty: 1, desc: 'list sockets numerically, no name lookups' },
  { text: 'sftp user@server', category: 'ssh-network', difficulty: 1, desc: 'start an interactive file transfer session' },
  { text: 'scp notes.txt user@server:', category: 'ssh-network', difficulty: 1, desc: 'copy a file to a remote home directory' },
  { text: 'arp -a', category: 'ssh-network', difficulty: 1, desc: 'show the ip-to-mac address cache' },
  // tier 2
  { text: 'ssh -p 2222 admin@203.0.113.7', category: 'ssh-network', difficulty: 2, desc: 'connect on a non-standard ssh port' },
  { text: 'ssh-keygen -t ed25519 -C "work laptop"', category: 'ssh-network', difficulty: 2, desc: 'generate a modern ssh keypair with a comment' },
  { text: 'ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server', category: 'ssh-network', difficulty: 2, desc: 'install your public key on a remote host' },
  { text: 'scp -r ./dist user@web01:/var/www/html', category: 'ssh-network', difficulty: 2, desc: 'recursively copy a build to a web server' },
  { text: 'curl -s https://api.github.com/zen', category: 'ssh-network', difficulty: 2, desc: 'call an api quietly, body only' },
  { text: 'curl -L -o latest.tar.gz https://example.com/latest', category: 'ssh-network', difficulty: 2, desc: 'follow redirects and save to a file' },
  { text: 'wget -c https://mirror.example.com/iso/distro.iso', category: 'ssh-network', difficulty: 2, desc: 'resume a large interrupted download' },
  { text: 'dig +short MX example.com', category: 'ssh-network', difficulty: 2, desc: 'just the mail servers, nothing else' },
  { text: 'nslookup -type=TXT example.com 8.8.8.8', category: 'ssh-network', difficulty: 2, desc: 'query txt records against a specific resolver' },
  { text: 'traceroute -n -m 20 example.com', category: 'ssh-network', difficulty: 2, desc: 'trace up to 20 hops without dns lookups' },
  { text: 'ss -tulpn', category: 'ssh-network', difficulty: 2, desc: 'listening tcp and udp sockets with owning pids' },
  { text: 'ip -4 addr show dev eth0', category: 'ssh-network', difficulty: 2, desc: 'ipv4 addresses on one interface' },
  { text: 'nmap -sV 192.168.1.1', category: 'ssh-network', difficulty: 2, desc: 'probe open ports and identify services' },
  { text: 'netstat -tulpn | grep LISTEN', category: 'ssh-network', difficulty: 2, desc: 'filter the socket list to listeners only' },
  { text: 'ping -c 10 -i 0.2 192.168.1.254', category: 'ssh-network', difficulty: 2, desc: 'fast burst of pings to the gateway' },
  { text: 'openssl s_client -connect example.com:443', category: 'ssh-network', difficulty: 2, desc: 'open a raw tls session to inspect the handshake' },
  // tier 3
  { text: 'ssh -L 5432:localhost:5432 -N -f deploy@db01.internal.example.com', category: 'ssh-network', difficulty: 3, desc: 'background tunnel to a remote postgres' },
  { text: "ssh -i ~/.ssh/deploy_key -o BatchMode=yes deploy@10.0.0.5 'systemctl status app'", category: 'ssh-network', difficulty: 3, desc: 'run one remote command with a deploy key' },
  { text: 'scp -P 2222 -i ~/.ssh/id_ed25519 backup.tar.gz admin@backup01:/srv/backups/nightly/', category: 'ssh-network', difficulty: 3, desc: 'push a backup over a custom port with a key' },
  { text: 'sftp -b batch.txt -i ~/.ssh/id_rsa user@sftp.example.com', category: 'ssh-network', difficulty: 3, desc: 'scripted sftp transfer from a batch file' },
  { text: 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"t"}\' localhost:3000/api', category: 'ssh-network', difficulty: 3, desc: 'post json to a local api endpoint' },
  { text: 'curl -fsSL --retry 3 --max-time 30 https://api.example.com/health | jq .status', category: 'ssh-network', difficulty: 3, desc: 'health check with retries, parsed by jq' },
  { text: "wget -r -np -nH --cut-dirs=2 -A '*.pdf' https://docs.example.com/manuals/", category: 'ssh-network', difficulty: 3, desc: 'mirror just the pdfs from a docs site' },
  { text: 'dig @8.8.8.8 example.com ANY +noall +answer', category: 'ssh-network', difficulty: 3, desc: 'all records from google dns, answers only' },
  { text: 'nmap -sS -p 1-1024 -T4 -oN scan.txt 192.168.1.0/24', category: 'ssh-network', difficulty: 3, desc: 'syn scan the low ports of a whole subnet' },
  { text: 'openssl x509 -in cert.pem -noout -subject -dates -fingerprint', category: 'ssh-network', difficulty: 3, desc: 'inspect who a certificate is for and when it expires' },
  { text: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes', category: 'ssh-network', difficulty: 3, desc: 'mint a one-year self-signed certificate' },
  { text: 'ip route add 10.10.0.0/16 via 192.168.1.1 dev eth0 metric 100', category: 'ssh-network', difficulty: 3, desc: 'add a static route through the gateway' },
  { text: "ss -o state established '( dport = :443 or sport = :443 )'", category: 'ssh-network', difficulty: 3, desc: 'established https connections with timers' },
]
