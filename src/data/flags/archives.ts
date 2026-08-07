import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // tar
  { tool: 'tar', flag: '-czf', desc: 'create a gzip-compressed archive written to the given file (-c + -z + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-xzf', desc: 'extract a gzip-compressed archive from the given file (-x + -z + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-tf', desc: 'list the contents of the given archive without extracting (-t + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-xf', desc: 'extract from the given archive, auto-detecting compression (-x + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-cf', desc: 'create an uncompressed archive written to the given file (-c + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-czvf', desc: 'create a gzip archive verbosely, listing files as they are added (-c -z -v -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-cJf', desc: 'create an xz-compressed archive written to the given file (-c + -J + -f)', category: 'archives', difficulty: 2 },
  { tool: 'tar', flag: '-tvf', desc: 'verbosely list archive contents with sizes and permissions (-t + -v + -f)', category: 'archives', difficulty: 2 },
  { tool: 'tar', flag: '-xvf', desc: 'extract verbosely, listing files as they are written (-x + -v + -f)', category: 'archives', difficulty: 1 },
  { tool: 'tar', flag: '-C', desc: 'change to the given directory before extracting or archiving', category: 'archives', difficulty: 2 },
  { tool: 'tar', flag: '--strip-components', desc: 'drop N leading path components when extracting', category: 'archives', difficulty: 2 },
  { tool: 'tar', flag: '--exclude', desc: 'skip files matching the given pattern', category: 'archives', difficulty: 2 },
  { tool: 'tar', flag: '--exclude-vcs', desc: 'skip version-control directories like .git and .svn', category: 'archives', difficulty: 3 },
  // zip / unzip
  { tool: 'zip', flag: '-r', desc: 'zip directories recursively', category: 'archives', difficulty: 1 },
  { tool: 'zip', flag: '-9', desc: 'best (slowest) compression level', category: 'archives', difficulty: 2 },
  { tool: 'zip', flag: '-e', desc: 'encrypt the archive, prompting for a password', category: 'archives', difficulty: 2 },
  { tool: 'zip', flag: '-x', desc: 'exclude files matching the given patterns', category: 'archives', difficulty: 2 },
  { tool: 'unzip', flag: '-l', desc: 'list archive contents without extracting', category: 'archives', difficulty: 1 },
  { tool: 'unzip', flag: '-o', desc: 'overwrite existing files without prompting', category: 'archives', difficulty: 1 },
  { tool: 'unzip', flag: '-d', desc: 'extract into the given directory', category: 'archives', difficulty: 1 },
  { tool: 'unzip', flag: '-j', desc: 'junk paths: extract all files into one flat directory', category: 'archives', difficulty: 3 },
  { tool: 'unzip', flag: '-t', desc: 'test archive integrity without extracting', category: 'archives', difficulty: 2 },
  // gzip family
  { tool: 'gzip', flag: '-d', desc: 'decompress instead of compress', category: 'archives', difficulty: 1 },
  { tool: 'gzip', flag: '-k', desc: 'keep the original file instead of deleting it', category: 'archives', difficulty: 2 },
  { tool: 'gzip', flag: '-9', desc: 'best (slowest) compression level', category: 'archives', difficulty: 2 },
  { tool: 'gzip', flag: '-9v', desc: 'best compression with verbose ratio report (-9 + -v)', category: 'archives', difficulty: 2 },
  { tool: 'gzip', flag: '-dc', desc: 'decompress to stdout, keeping the original (-d + -c)', category: 'archives', difficulty: 2 },
  { tool: 'gzip', flag: '-c', desc: 'write to stdout, keeping the original file', category: 'archives', difficulty: 2 },
  { tool: 'gunzip', flag: '-c', desc: 'decompress to stdout, keeping the original file', category: 'archives', difficulty: 2 },
  // zstd
  { tool: 'zstd', flag: '-d', desc: 'decompress instead of compress', category: 'archives', difficulty: 1 },
  { tool: 'zstd', flag: '-o', desc: 'write output to the given file', category: 'archives', difficulty: 2 },
  { tool: 'zstd', flag: '-19', desc: 'very high compression level (max normal level is 19)', category: 'archives', difficulty: 2 },
  { tool: 'zstd', flag: '-T0', desc: 'multithread using all available cores (-T with thread count, 0 = auto)', category: 'archives', difficulty: 2 },
  { tool: 'zstd', flag: '--long', desc: 'enable long-distance matching for better ratios on big files', category: 'archives', difficulty: 3 },
  // xz
  { tool: 'xz', flag: '-d', desc: 'decompress instead of compress', category: 'archives', difficulty: 1 },
  { tool: 'xz', flag: '-6', desc: 'compression level 6 (the default preset)', category: 'archives', difficulty: 2 },
  { tool: 'xz', flag: '-9', desc: 'best (slowest, most memory-hungry) compression level', category: 'archives', difficulty: 2 },
  { tool: 'xz', flag: '-9e', desc: 'level 9 with the extreme modifier for extra compression (-9 + e)', category: 'archives', difficulty: 3 },
  { tool: 'xz', flag: '-T0', desc: 'multithread using all available cores (-T with thread count, 0 = auto)', category: 'archives', difficulty: 2 },
  { tool: 'xz', flag: '--keep', desc: 'keep the original file instead of deleting it', category: 'archives', difficulty: 2 },
  // 7z (flags follow the `a` add subcommand, e.g. `7z a -mx=9`)
  { tool: 'a', flag: '-mx', desc: '7-zip compression level (-mx=9 = maximum)', category: 'archives', difficulty: 2 },
  { tool: 'a', flag: '-t7z', desc: '7-zip archive format selector (-t with the format glued on)', category: 'archives', difficulty: 3 },
  { tool: 'a', flag: '-mhe', desc: '7-zip header encryption, hiding file names (-mhe=on)', category: 'archives', difficulty: 3 },
  { tool: 'a', flag: '-psecret', desc: '7-zip archive password (-p with the password glued on)', category: 'archives', difficulty: 3 },
  // split
  { tool: 'split', flag: '-b', desc: 'split into pieces of the given byte size (e.g. 100M)', category: 'archives', difficulty: 2 },
  { tool: 'split', flag: '-l', desc: 'split into pieces of the given number of lines', category: 'archives', difficulty: 2 },
  { tool: 'split', flag: '-d', desc: 'use numeric suffixes (00, 01, ...) instead of letters', category: 'archives', difficulty: 2 },
  { tool: 'split', flag: '--additional-suffix', desc: 'append the given suffix to each piece name', category: 'archives', difficulty: 3 },
  // helpers appearing in archive pipelines
  { tool: 'wc', flag: '-l', desc: 'count lines instead of words and bytes', category: 'archives', difficulty: 1 },
  { tool: 'grep', flag: '-c', desc: 'print only a count of matching lines', category: 'archives', difficulty: 1 },
  { tool: 'find', flag: '-name', desc: 'match files by name pattern', category: 'archives', difficulty: 1 },
  { tool: 'find', flag: '-mtime', desc: 'filter by modification time in days', category: 'archives', difficulty: 2 },
  { tool: 'find', flag: '-print0', desc: 'print results NUL-separated for safe piping into xargs -0', category: 'archives', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  // -0 belongs to xargs (read NUL-separated input), which the extractor treats as a separator
  'find . -name "*.log" -mtime +30 -print0 | xargs -0 tar -czf old-logs.tar.gz :: -0',
]
