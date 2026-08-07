import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const archives: CommandEntry[] = [
  // tier 1
  { text: 'tar -xzf release.tar.gz', category: 'archives', difficulty: 1, desc: 'extract a gzip-compressed tarball' },
  { text: 'tar -czf logs.tar.gz logs/', category: 'archives', difficulty: 1, desc: 'create a compressed tarball of a directory' },
  { text: 'tar -tf backup.tar', category: 'archives', difficulty: 1, desc: 'list the contents of a tar archive' },
  { text: 'unzip archive.zip', category: 'archives', difficulty: 1, desc: 'extract a zip into the current directory' },
  { text: 'unzip -l bundle.zip', category: 'archives', difficulty: 1, desc: 'list zip contents without extracting' },
  { text: 'zip -r site.zip public/', category: 'archives', difficulty: 1, desc: 'zip a directory recursively' },
  { text: 'gzip access.log', category: 'archives', difficulty: 1, desc: 'compress a file, replacing it with a .gz' },
  { text: 'gzip -d access.log.gz', category: 'archives', difficulty: 1, desc: 'decompress a gzip file in place' },
  { text: 'gzip -k report.csv', category: 'archives', difficulty: 1, desc: 'compress while keeping the original file' },
  { text: 'gunzip dump.sql.gz', category: 'archives', difficulty: 1, desc: 'decompress a gzip file' },
  { text: 'zstd big.log', category: 'archives', difficulty: 1, desc: 'compress a file with zstandard' },
  { text: 'zstd -d data.zst', category: 'archives', difficulty: 1, desc: 'decompress a zstandard file' },
  { text: 'xz -d kernel.tar.xz', category: 'archives', difficulty: 1, desc: 'decompress an xz file in place' },
  { text: 'xz -9 core.dump', category: 'archives', difficulty: 1, desc: 'compress a file at maximum xz level' },
  { text: '7z x archive.7z', category: 'archives', difficulty: 1, desc: 'extract a 7-zip archive with full paths' },
  { text: '7z l backup.7z', category: 'archives', difficulty: 1, desc: 'list the contents of a 7-zip archive' },
  // tier 2
  { text: 'tar -xzf app.tar.gz -C /opt/app', category: 'archives', difficulty: 2, desc: 'extract a tarball into a specific directory' },
  { text: 'tar -czvf notes.tar.gz --exclude=".cache" ~/notes', category: 'archives', difficulty: 2, desc: 'verbose backup that skips the cache directory' },
  { text: 'tar -cJf logs.tar.xz /var/log/nginx', category: 'archives', difficulty: 2, desc: 'create an xz-compressed tarball' },
  { text: 'tar --strip-components=1 -xzf release.tar.gz', category: 'archives', difficulty: 2, desc: 'drop the top-level directory while extracting' },
  { text: 'unzip -o build.zip -d dist/', category: 'archives', difficulty: 2, desc: 'extract into a target directory, overwriting' },
  { text: 'unzip -j photos.zip "*.jpg" -d images/', category: 'archives', difficulty: 2, desc: 'extract only the jpegs, flattening paths' },
  { text: 'zip -e secrets.zip credentials.json', category: 'archives', difficulty: 2, desc: 'create a password-protected zip' },
  { text: 'zip -r repo.zip . -x "*.git*"', category: 'archives', difficulty: 2, desc: 'zip the tree while excluding git metadata' },
  { text: 'gzip -9v huge.sql', category: 'archives', difficulty: 2, desc: 'best compression with a per-file ratio report' },
  { text: 'zcat access.log.gz | wc -l', category: 'archives', difficulty: 2, desc: 'count lines without decompressing to disk' },
  { text: 'gunzip -c dump.sql.gz > dump.sql', category: 'archives', difficulty: 2, desc: 'decompress to a new file, keeping the .gz' },
  { text: 'zstd -19 --long dataset.csv', category: 'archives', difficulty: 2, desc: 'high zstd compression with a long match window' },
  { text: 'zstd -T0 -o backup.zst backup.tar', category: 'archives', difficulty: 2, desc: 'multithreaded zstd to a named output file' },
  { text: 'xz -T0 -6 disk.img', category: 'archives', difficulty: 2, desc: 'compress with all cpu cores at level 6' },
  { text: '7z a -mx=9 docs.7z docs/', category: 'archives', difficulty: 2, desc: 'add a directory to a 7z at max compression' },
  { text: 'split -b 100M big.iso chunk_', category: 'archives', difficulty: 2, desc: 'split a file into 100 megabyte pieces' },
  { text: 'split -l 50000 access.log part-', category: 'archives', difficulty: 2, desc: 'split a file every 50000 lines' },
  // tier 3
  { text: 'tar -czf backup-$(date +%F).tar.gz --exclude-vcs --exclude "*.tmp" /etc /home/deploy', category: 'archives', difficulty: 3, desc: 'dated backup of two trees, skipping vcs dirs and temp files' },
  { text: 'tar -cf - /data | zstd -T0 -19 -o data-$(date +%F).tar.zst', category: 'archives', difficulty: 3, desc: 'stream a tarball straight into multithreaded zstd' },
  { text: 'tar -xzf release.tar.gz --strip-components=1 -C /opt/app && sudo systemctl restart app', category: 'archives', difficulty: 3, desc: 'deploy a release tarball and bounce the service' },
  { text: 'ssh db01 "pg_dump appdb" | gzip -9 > appdb-$(date +%F).sql.gz', category: 'archives', difficulty: 3, desc: 'dump a remote database into a dated local gzip' },
  { text: 'find . -name "*.log" -mtime +30 -print0 | xargs -0 tar -czf old-logs.tar.gz', category: 'archives', difficulty: 3, desc: 'archive every log file older than 30 days' },
  { text: 'zip -r -9 site.zip public/ -x "*.map" "*.DS_Store" && unzip -t site.zip', category: 'archives', difficulty: 3, desc: 'zip a site without source maps, then verify the archive' },
  { text: 'split -b 2G -d --additional-suffix=.part backup.tar.zst backup-', category: 'archives', difficulty: 3, desc: 'cut a huge archive into numbered 2 gigabyte parts' },
  { text: 'cat backup-0*.part | zstd -d -o backup.tar && tar -xf backup.tar -C /restore', category: 'archives', difficulty: 3, desc: 'reassemble split parts, decompress, and extract' },
  { text: '7z a -t7z -mx=9 -mhe=on -psecret vault.7z ~/documents/tax-2025', category: 'archives', difficulty: 3, desc: 'encrypted 7z that also hides the file names' },
  { text: 'xz -T0 -9e --keep disk.img && sha256sum disk.img.xz > disk.img.xz.sha256', category: 'archives', difficulty: 3, desc: 'extreme xz compression plus a checksum file' },
  { text: 'tar -tvf backup.tar | awk \'{sum+=$3} END {print sum/1048576 " MB"}\'', category: 'archives', difficulty: 3, desc: 'total the uncompressed size of a tar archive' },
  { text: 'gzip -dc access-*.log.gz | grep -c " 500 " >> error-counts.txt', category: 'archives', difficulty: 3, desc: 'count server errors across rotated gzip logs' },
  { text: 'tar --exclude="node_modules" --exclude=".git" -czf src-$(date +%s).tar.gz .', category: 'archives', difficulty: 3, desc: 'timestamped source snapshot without deps or history' },
]
