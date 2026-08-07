import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // npm
  { tool: 'npm init', flag: '-y', desc: 'accept all defaults without prompting', category: 'npm', difficulty: 1 },
  { tool: 'npm install', flag: '-D', desc: 'save as a devDependency', category: 'npm', difficulty: 1 },
  { tool: 'npm install', flag: '--save-dev', desc: 'save as a devDependency (long form of -D)', category: 'npm', difficulty: 1 },
  { tool: 'npm install', flag: '-g', desc: 'install globally instead of into the project', category: 'npm', difficulty: 1 },
  { tool: 'npm install', flag: '--save-exact', desc: 'pin the exact version, no ^ range', category: 'npm', difficulty: 2 },
  { tool: 'npm install', flag: '--legacy-peer-deps', desc: 'skip strict peer dependency resolution', category: 'npm', difficulty: 2 },
  { tool: 'npm install', flag: '--production', desc: 'skip devDependencies', category: 'npm', difficulty: 2 },
  { tool: 'npm run', flag: '--watch', desc: 'forwarded to the test runner: rerun on file changes', category: 'npm', difficulty: 2 },
  { tool: 'npm run', flag: '--analyze', desc: 'forwarded to the build script: emit a bundle analysis report', category: 'npm', difficulty: 3 },
  { tool: 'npm run', flag: '--out-dir', desc: 'forwarded to the build script: output directory', category: 'npm', difficulty: 3 },
  { tool: 'npm', flag: '--workspace', desc: 'run the command in a specific workspace package', category: 'npm', difficulty: 2 },
  { tool: 'npm view', flag: '--json', desc: 'print registry data as json', category: 'npm', difficulty: 2 },
  { tool: 'npm ls', flag: '--depth', desc: 'how many levels of the dependency tree to show', category: 'npm', difficulty: 2 },
  { tool: 'npm ls', flag: '--all', desc: 'show the full dependency tree, not just top level', category: 'npm', difficulty: 2 },
  { tool: 'npm audit', flag: '--force', desc: 'apply fixes even if they include breaking upgrades', category: 'npm', difficulty: 2 },
  { tool: 'npm cache', flag: '--force', desc: 'required confirmation to actually clear the cache', category: 'npm', difficulty: 2 },
  { tool: 'npm version', flag: '-m', desc: 'commit message for the version bump, %s is the version', category: 'npm', difficulty: 2 },
  { tool: 'npm publish', flag: '--access', desc: 'public or restricted visibility for scoped packages', category: 'npm', difficulty: 2 },
  { tool: 'npm publish', flag: '--tag', desc: 'publish under a dist-tag instead of latest', category: 'npm', difficulty: 2 },
  { tool: 'npm publish', flag: '--dry-run', desc: 'show what would be published without uploading', category: 'npm', difficulty: 2 },
  { tool: 'npm pack', flag: '--dry-run', desc: 'show the tarball contents without writing it', category: 'npm', difficulty: 2 },
  { tool: 'npm config', flag: '--location', desc: 'which config file to write: project, user or global', category: 'npm', difficulty: 3 },
  // node
  { tool: 'node', flag: '--version', desc: 'print the node.js version', category: 'npm', difficulty: 1 },
  { tool: 'node', flag: '--watch', desc: 'restart the process when watched files change', category: 'npm', difficulty: 2 },
  { tool: 'node', flag: '-e', desc: 'evaluate the given string as a script', category: 'npm', difficulty: 2 },
  { tool: 'node', flag: '--max-old-space-size', desc: 'v8 heap memory limit in megabytes', category: 'npm', difficulty: 3 },
  { tool: 'node', flag: '--inspect-brk', desc: 'start the debugger and break before user code runs', category: 'npm', difficulty: 3 },
  // npx & scaffolding
  { tool: 'npx', flag: '--template', desc: 'project template to scaffold from', category: 'npm', difficulty: 2 },
  { tool: 'npx', flag: '-y', desc: 'install the package without a confirmation prompt', category: 'npm', difficulty: 2 },
  // pnpm & turbo
  { tool: 'pnpm add', flag: '-D', desc: 'save as a devDependency', category: 'npm', difficulty: 1 },
  { tool: 'pnpm', flag: '--filter', desc: 'limit the command to matching workspace packages', category: 'npm', difficulty: 2 },
  { tool: 'pnpm', flag: '--if-present', desc: 'do not fail when a package lacks the script', category: 'npm', difficulty: 3 },
  { tool: 'turbo', flag: '--cache-dir', desc: 'directory for the turborepo task cache', category: 'npm', difficulty: 3 },
  // dev tools commonly run via npx
  { tool: 'prettier', flag: '--write', desc: 'format the files in place', category: 'npm', difficulty: 1 },
  { tool: 'eslint', flag: '--ext', desc: 'file extensions to lint', category: 'npm', difficulty: 2 },
  { tool: 'eslint', flag: '--max-warnings', desc: 'fail if more than this many warnings', category: 'npm', difficulty: 2 },
  { tool: 'eslint', flag: '--cache', desc: 'only re-lint files that changed since last run', category: 'npm', difficulty: 2 },
  { tool: 'eslint', flag: '--cache-location', desc: 'where to store the lint cache file', category: 'npm', difficulty: 3 },
  { tool: 'tsc', flag: '--noEmit', desc: 'type-check only, write no output files', category: 'npm', difficulty: 1 },
  { tool: 'tsc', flag: '--strict', desc: 'enable all strict type-checking options', category: 'npm', difficulty: 2 },
  { tool: 'tsc', flag: '--skipLibCheck', desc: 'skip type-checking declaration files', category: 'npm', difficulty: 2 },
  { tool: 'tsc', flag: '-p', desc: 'build the project described by this tsconfig', category: 'npm', difficulty: 1 },
  { tool: 'tsc', flag: '--pretty', desc: 'toggle colored, formatted diagnostics', category: 'npm', difficulty: 3 },
  { tool: 'vitest', flag: '--coverage', desc: 'collect and report test coverage', category: 'npm', difficulty: 2 },
  { tool: 'vitest', flag: '--coverage.thresholds.lines', desc: 'fail if line coverage drops below this percent', category: 'npm', difficulty: 3 },
  { tool: 'vitest', flag: '--reporter', desc: 'test report format, e.g. junit', category: 'npm', difficulty: 2 },
  { tool: 'npm-check-updates', flag: '-u', desc: 'rewrite package.json with the newer versions', category: 'npm', difficulty: 3 },
  { tool: 'npm-check-updates', flag: '--target', desc: 'which upgrades to take: latest, minor or patch', category: 'npm', difficulty: 3 },
  // shell helpers in npm one-liners
  { tool: 'grep', flag: '-E', desc: 'use extended regular expressions', category: 'npm', difficulty: 2 },
  { tool: 'sort', flag: '-u', desc: 'sort and drop duplicate lines', category: 'npm', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = [
  // webpack/jest flags reached via a node_modules/.bin path attribute to `node`,
  // where a glossary entry would be misleading
  'node --max-old-space-size=4096 node_modules/.bin/webpack --mode production --profile :: --mode',
  'node --max-old-space-size=4096 node_modules/.bin/webpack --mode production --profile :: --profile',
  'node --inspect-brk=0.0.0.0:9229 node_modules/.bin/jest --runInBand --testTimeout=30000 :: --runInBand',
  'node --inspect-brk=0.0.0.0:9229 node_modules/.bin/jest --runInBand --testTimeout=30000 :: --testTimeout',
]
