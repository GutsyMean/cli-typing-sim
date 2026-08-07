import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // grep
  { tool: 'grep', flag: '-r', desc: 'search directories recursively', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-i', desc: 'case-insensitive matching', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-n', desc: 'prefix each match with its line number', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-rn', desc: 'recursive search showing line numbers (-r + -n)', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-v', desc: 'invert the match: print lines that do NOT match', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-c', desc: 'print only a count of matching lines', category: 'text-tools', difficulty: 1 },
  { tool: 'grep', flag: '-l', desc: 'print only names of files containing matches', category: 'text-tools', difficulty: 2 },
  { tool: 'grep', flag: '-E', desc: 'use extended regular expressions', category: 'text-tools', difficulty: 2 },
  { tool: 'grep', flag: '-o', desc: 'print only the matching part of each line', category: 'text-tools', difficulty: 2 },
  { tool: 'grep', flag: '-rEl', desc: 'recursive extended-regex search listing only file names (-r + -E + -l)', category: 'text-tools', difficulty: 2 },
  { tool: 'grep', flag: '-oE', desc: 'print only the parts matching an extended regex (-o + -E)', category: 'text-tools', difficulty: 2 },
  { tool: 'grep', flag: '--include', desc: 'recurse only into files matching the given glob', category: 'text-tools', difficulty: 2 },
  // ripgrep
  { tool: 'rg', flag: '-i', desc: 'case-insensitive matching', category: 'text-tools', difficulty: 1 },
  { tool: 'rg', flag: '-n', desc: 'show line numbers (default on a tty)', category: 'text-tools', difficulty: 1 },
  { tool: 'rg', flag: '-t', desc: 'search only files of the given type (e.g. py, js)', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '-g', desc: 'include/exclude files by glob (! negates)', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '-A', desc: 'show N lines of context after each match', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '-B', desc: 'show N lines of context before each match', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '-w', desc: 'match whole words only', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '--files-with-matches', desc: 'print only names of files containing matches', category: 'text-tools', difficulty: 2 },
  { tool: 'rg', flag: '--no-heading', desc: 'print file name on every line instead of grouped headings', category: 'text-tools', difficulty: 3 },
  // sed
  { tool: 'sed', flag: '-n', desc: 'suppress automatic printing; only print what the script says (e.g. 5p)', category: 'text-tools', difficulty: 2 },
  { tool: 'sed', flag: '-i', desc: 'edit the file in place', category: 'text-tools', difficulty: 1 },
  { tool: 'sed', flag: '-E', desc: 'use extended regular expressions in the script', category: 'text-tools', difficulty: 2 },
  // awk
  { tool: 'awk', flag: '-F,', desc: 'use comma as the field separator (-F with the separator glued on)', category: 'text-tools', difficulty: 1 },
  { tool: 'awk', flag: '-v', desc: 'set an awk variable before the script runs', category: 'text-tools', difficulty: 2 },
  // cut
  { tool: 'cut', flag: '-d,', desc: 'use comma as the field delimiter (-d with the delimiter glued on)', category: 'text-tools', difficulty: 1 },
  { tool: 'cut', flag: '-d:', desc: 'use colon as the field delimiter (-d with the delimiter glued on)', category: 'text-tools', difficulty: 1 },
  { tool: 'cut', flag: '-f1', desc: 'select field 1 (-f with the field list glued on)', category: 'text-tools', difficulty: 1 },
  { tool: 'cut', flag: '-f1,7', desc: 'select fields 1 and 7 (-f with the field list glued on)', category: 'text-tools', difficulty: 1 },
  { tool: 'cut', flag: '-f2,5', desc: 'select fields 2 and 5 (-f with the field list glued on)', category: 'text-tools', difficulty: 1 },
  // sort
  { tool: 'sort', flag: '-u', desc: 'output only unique lines (sort + dedupe)', category: 'text-tools', difficulty: 1 },
  { tool: 'sort', flag: '-n', desc: 'sort numerically instead of lexically', category: 'text-tools', difficulty: 1 },
  { tool: 'sort', flag: '-r', desc: 'reverse the sort order', category: 'text-tools', difficulty: 1 },
  { tool: 'sort', flag: '-rn', desc: 'numeric sort in descending order (-r + -n)', category: 'text-tools', difficulty: 1 },
  { tool: 'sort', flag: '-t,', desc: 'use comma as the field separator (-t with the separator glued on)', category: 'text-tools', difficulty: 2 },
  { tool: 'sort', flag: '-t:', desc: 'use colon as the field separator (-t with the separator glued on)', category: 'text-tools', difficulty: 2 },
  { tool: 'sort', flag: '-k2', desc: 'sort by the 2nd field (-k with the key glued on)', category: 'text-tools', difficulty: 2 },
  { tool: 'sort', flag: '-k3', desc: 'sort by the 3rd field (-k with the key glued on)', category: 'text-tools', difficulty: 2 },
  { tool: 'sort', flag: '-k1,1', desc: 'sort by field 1 only, stopping at field 1 (-k with start,end glued on)', category: 'text-tools', difficulty: 3 },
  // uniq
  { tool: 'uniq', flag: '-c', desc: 'prefix each line with its repeat count', category: 'text-tools', difficulty: 1 },
  { tool: 'uniq', flag: '-d', desc: 'print only lines that appear more than once', category: 'text-tools', difficulty: 2 },
  // tr
  { tool: 'tr', flag: '-d', desc: 'delete the given characters from the input', category: 'text-tools', difficulty: 1 },
  { tool: 'tr', flag: '-s', desc: 'squeeze repeated occurrences of a character into one', category: 'text-tools', difficulty: 2 },
  { tool: 'tr', flag: '-cs', desc: 'complement the set, then squeeze repeats (-c + -s)', category: 'text-tools', difficulty: 3 },
  // column / paste
  { tool: 'column', flag: '-t', desc: 'align input into a table based on whitespace', category: 'text-tools', difficulty: 2 },
  { tool: 'column', flag: '-s,', desc: 'use comma as the input separator (-s with the separator glued on)', category: 'text-tools', difficulty: 2 },
  { tool: 'paste', flag: '-d,', desc: 'join lines side by side separated by comma (-d with the delimiter glued on)', category: 'text-tools', difficulty: 2 },
  // jq / yq
  { tool: 'jq', flag: '-r', desc: 'raw output: print strings without JSON quotes', category: 'text-tools', difficulty: 1 },
  { tool: 'jq', flag: '-c', desc: 'compact output: one JSON value per line', category: 'text-tools', difficulty: 2 },
  { tool: 'jq', flag: '--arg', desc: 'pass a named string variable into the filter', category: 'text-tools', difficulty: 2 },
  { tool: 'yq', flag: '-i', desc: 'edit the YAML file in place', category: 'text-tools', difficulty: 2 },
  // helpers appearing in text pipelines
  { tool: 'head', flag: '-n', desc: 'output only the first N lines', category: 'text-tools', difficulty: 1 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  // -r belongs to xargs (no-run-if-empty), which the extractor treats as a separator
  'grep -rEl "api[_-]?key" --include="*.env*" . | xargs -r chmod 600 :: -r',
]
