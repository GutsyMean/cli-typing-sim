import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const textTools: CommandEntry[] = [
  // tier 1
  { text: 'grep -r "TODO" .', category: 'text-tools', difficulty: 1, desc: 'search the whole tree for a string' },
  { text: 'grep -i "error" app.log', category: 'text-tools', difficulty: 1, desc: 'case-insensitive search in a file' },
  { text: 'grep -n "main" src/app.ts', category: 'text-tools', difficulty: 1, desc: 'search a file, printing line numbers' },
  { text: 'rg "fixme"', category: 'text-tools', difficulty: 1, desc: 'fast recursive search with ripgrep' },
  { text: 'rg -i "password" src/', category: 'text-tools', difficulty: 1, desc: 'case-insensitive ripgrep over a directory' },
  { text: 'sed -n \'5p\' notes.txt', category: 'text-tools', difficulty: 1, desc: 'print only line 5 of a file' },
  { text: 'sed \'s/foo/bar/\' input.txt', category: 'text-tools', difficulty: 1, desc: 'replace the first match on each line' },
  { text: 'awk \'{print $1}\' access.log', category: 'text-tools', difficulty: 1, desc: 'print the first field of every line' },
  { text: 'jq . response.json', category: 'text-tools', difficulty: 1, desc: 'pretty-print a json file' },
  { text: 'jq \'.version\' package.json', category: 'text-tools', difficulty: 1, desc: 'pull one field out of a json file' },
  { text: 'yq \'.spec.replicas\' deploy.yaml', category: 'text-tools', difficulty: 1, desc: 'read a nested value from a yaml file' },
  { text: 'cut -d, -f1 users.csv', category: 'text-tools', difficulty: 1, desc: 'take the first column of a csv' },
  { text: 'sort -u domains.txt', category: 'text-tools', difficulty: 1, desc: 'sort a file and drop duplicate lines' },
  { text: 'uniq -c sorted.txt', category: 'text-tools', difficulty: 1, desc: 'count consecutive duplicate lines' },
  { text: 'tr a-z A-Z < input.txt', category: 'text-tools', difficulty: 1, desc: 'uppercase everything on stdin' },
  { text: 'column -t data.txt', category: 'text-tools', difficulty: 1, desc: 'align whitespace-separated columns' },
  { text: 'paste a.txt b.txt', category: 'text-tools', difficulty: 1, desc: 'merge two files line by line' },
  // tier 2
  { text: 'grep -rn --include="*.ts" "useEffect" src/', category: 'text-tools', difficulty: 2, desc: 'search only typescript files, with line numbers' },
  { text: 'grep -v "^#" app.conf | grep -v "^$"', category: 'text-tools', difficulty: 2, desc: 'strip comments and blank lines from a config' },
  { text: 'rg -t py --files-with-matches "def main"', category: 'text-tools', difficulty: 2, desc: 'list python files containing a pattern' },
  { text: 'rg -A 3 -B 1 "panic" server.log', category: 'text-tools', difficulty: 2, desc: 'show matches with surrounding context lines' },
  { text: 'sed -i \'s/http:/https:/g\' links.txt', category: 'text-tools', difficulty: 2, desc: 'replace every match, editing the file in place' },
  { text: 'sed \'/^$/d\' notes.md', category: 'text-tools', difficulty: 2, desc: 'delete all blank lines' },
  { text: 'awk -F, \'{print $2}\' users.csv | sort | uniq -c', category: 'text-tools', difficulty: 2, desc: 'frequency count of the second csv column' },
  { text: 'awk \'NR % 10 == 0\' huge.log', category: 'text-tools', difficulty: 2, desc: 'sample every tenth line of a big file' },
  { text: 'jq -r \'.[].id\' users.json', category: 'text-tools', difficulty: 2, desc: 'raw ids from every element of a json array' },
  { text: 'jq \'.dependencies | keys\' package.json', category: 'text-tools', difficulty: 2, desc: 'list dependency names from package.json' },
  { text: 'yq -i \'.image.tag = "v2.1.0"\' values.yaml', category: 'text-tools', difficulty: 2, desc: 'bump a yaml value, editing the file in place' },
  { text: 'cut -d: -f1,7 /etc/passwd', category: 'text-tools', difficulty: 2, desc: 'show each user and their login shell' },
  { text: 'sort -t, -k3 -n sales.csv', category: 'text-tools', difficulty: 2, desc: 'sort a csv numerically by its third column' },
  { text: 'sort -rn -k2 scores.txt | head', category: 'text-tools', difficulty: 2, desc: 'top scores, highest second column first' },
  { text: 'uniq -d emails-sorted.txt', category: 'text-tools', difficulty: 2, desc: 'show only the lines that repeat' },
  { text: 'tr -d \'\\r\' < dos.txt > unix.txt', category: 'text-tools', difficulty: 2, desc: 'strip carriage returns from a dos file' },
  { text: 'tr -s \' \' < messy.txt', category: 'text-tools', difficulty: 2, desc: 'squeeze runs of spaces down to one' },
  { text: 'paste -d, ids.txt names.txt > merged.csv', category: 'text-tools', difficulty: 2, desc: 'join two column files into a csv' },
  // tier 3
  { text: 'awk -F, \'NR>1 {sum+=$3; n++} END {printf "avg %.2f\\n", sum/n}\' sales.csv', category: 'text-tools', difficulty: 3, desc: 'average a csv column, skipping the header row' },
  { text: 'grep -rEl "api[_-]?key" --include="*.env*" . | xargs -r chmod 600', category: 'text-tools', difficulty: 3, desc: 'lock down every env file that mentions an api key' },
  { text: 'jq -r \'.items[] | select(.status=="failed") | .name\' jobs.json | sort -u', category: 'text-tools', difficulty: 3, desc: 'unique names of failed jobs from a json report' },
  { text: 'sed -E \'s/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/g\' dates.txt', category: 'text-tools', difficulty: 3, desc: 'rewrite iso dates as day/month/year' },
  { text: 'rg -n --no-heading "TODO|FIXME|HACK" -g \'!node_modules\' | sort -t: -k1,1', category: 'text-tools', difficulty: 3, desc: 'collect all code debt markers, grouped by file' },
  { text: 'awk \'{c[$1]++} END {for (ip in c) print c[ip], ip}\' access.log | sort -rn | head', category: 'text-tools', difficulty: 3, desc: 'busiest client ips from an access log' },
  { text: 'jq --arg env prod \'.envs[] | select(.name==$env) | .vars | keys[]\' config.json', category: 'text-tools', difficulty: 3, desc: 'variable names for one environment, via a jq argument' },
  { text: 'yq eval-all \'select(.kind=="Deployment") | .metadata.name\' manifests/*.yaml', category: 'text-tools', difficulty: 3, desc: 'deployment names across a directory of manifests' },
  { text: 'cut -d, -f2,5 orders.csv | sort -t, -k2 -rn | head -n 20 | column -s, -t', category: 'text-tools', difficulty: 3, desc: 'top 20 orders by value, as an aligned table' },
  { text: 'tr -cs \'A-Za-z\' \'\\n\' < book.txt | sort | uniq -c | sort -rn | head', category: 'text-tools', difficulty: 3, desc: 'the most frequent words in a text file' },
  { text: 'sed -n \'/-----BEGIN CERT/,/-----END CERT/p\' bundle.pem > first.pem', category: 'text-tools', difficulty: 3, desc: 'extract the certificate block from a pem bundle' },
  { text: 'grep -oE \'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\' contacts.txt | sort -u > emails.txt', category: 'text-tools', difficulty: 3, desc: 'harvest unique email addresses from a file' },
  { text: 'awk \'BEGIN{FS=OFS=","} $4=="US" {$5*=1.08} 1\' orders.csv > orders-taxed.csv', category: 'text-tools', difficulty: 3, desc: 'apply sales tax to us rows of a csv' },
]
