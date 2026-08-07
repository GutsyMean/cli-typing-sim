import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const npm: CommandEntry[] = [
  // tier 1
  { text: 'npm install', category: 'npm', difficulty: 1, desc: 'install dependencies from package.json' },
  { text: 'npm ci', category: 'npm', difficulty: 1, desc: 'clean reproducible install from the lockfile' },
  { text: 'npm run dev', category: 'npm', difficulty: 1, desc: 'start the development server script' },
  { text: 'npm run build', category: 'npm', difficulty: 1, desc: 'run the production build script' },
  { text: 'npm test', category: 'npm', difficulty: 1, desc: 'run the test script' },
  { text: 'npm start', category: 'npm', difficulty: 1, desc: 'run the start script' },
  { text: 'npm install express', category: 'npm', difficulty: 1, desc: 'add a package as a dependency' },
  { text: 'npm uninstall lodash', category: 'npm', difficulty: 1, desc: 'remove a package and update package.json' },
  { text: 'npm outdated', category: 'npm', difficulty: 1, desc: 'list dependencies with newer versions' },
  { text: 'npm audit', category: 'npm', difficulty: 1, desc: 'scan dependencies for known vulnerabilities' },
  { text: 'npm run lint', category: 'npm', difficulty: 1, desc: 'run the lint script' },
  { text: 'npm init -y', category: 'npm', difficulty: 1, desc: 'create a package.json with defaults' },
  { text: 'node index.js', category: 'npm', difficulty: 1, desc: 'run a script with node' },
  { text: 'node --version', category: 'npm', difficulty: 1, desc: 'print the installed node version' },
  { text: 'yarn install', category: 'npm', difficulty: 1, desc: 'install dependencies with yarn' },
  { text: 'pnpm install', category: 'npm', difficulty: 1, desc: 'install dependencies with pnpm' },
  // tier 2
  { text: 'npm install -D typescript @types/node', category: 'npm', difficulty: 2, desc: 'add dev dependencies in one command' },
  { text: 'npm install -g pnpm', category: 'npm', difficulty: 2, desc: 'install a package globally' },
  { text: 'npm run test -- --watch', category: 'npm', difficulty: 2, desc: 'pass extra flags through to a script' },
  { text: 'npm view react versions --json', category: 'npm', difficulty: 2, desc: 'list every published version of a package' },
  { text: 'npm ls --depth=0', category: 'npm', difficulty: 2, desc: 'show only top-level installed packages' },
  { text: 'npm audit fix --force', category: 'npm', difficulty: 2, desc: 'apply vulnerability fixes, even breaking ones' },
  { text: 'npm config set registry https://registry.npmjs.org/', category: 'npm', difficulty: 2, desc: 'point npm at a specific registry' },
  { text: 'npx create-vite@latest my-app --template react-ts', category: 'npm', difficulty: 2, desc: 'scaffold a react and typescript project' },
  { text: 'npx prettier --write "src/**/*.ts"', category: 'npm', difficulty: 2, desc: 'format every typescript file in place' },
  { text: 'node --watch server.js', category: 'npm', difficulty: 2, desc: 'restart a script automatically on change' },
  { text: 'npm version patch -m "release %s"', category: 'npm', difficulty: 2, desc: 'bump the patch version and tag the commit' },
  { text: 'npm publish --access public', category: 'npm', difficulty: 2, desc: 'publish a scoped package publicly' },
  { text: 'pnpm add -D vitest @vitest/ui', category: 'npm', difficulty: 2, desc: 'add test tooling as dev dependencies' },
  { text: 'yarn add react react-dom', category: 'npm', difficulty: 2, desc: 'add runtime dependencies with yarn' },
  { text: 'npm pack --dry-run', category: 'npm', difficulty: 2, desc: 'preview which files would be published' },
  { text: 'npm cache clean --force', category: 'npm', difficulty: 2, desc: 'wipe the local package cache' },
  // tier 3
  { text: 'npm install --save-exact react@18.3.1 react-dom@18.3.1 && npm dedupe', category: 'npm', difficulty: 3, desc: 'pin exact versions, then flatten the tree' },
  { text: 'npx eslint . --ext .ts,.tsx --max-warnings 0 --cache --cache-location .eslintcache', category: 'npm', difficulty: 3, desc: 'strict cached lint over the whole project' },
  { text: 'node --max-old-space-size=4096 node_modules/.bin/webpack --mode production --profile', category: 'npm', difficulty: 3, desc: 'big-heap production bundle with timing data' },
  { text: 'npm run build && npm run test:ci && npm publish --tag beta --access public', category: 'npm', difficulty: 3, desc: 'gate a beta release behind build and tests' },
  { text: 'npx tsc --noEmit --strict --skipLibCheck -p tsconfig.build.json --pretty false', category: 'npm', difficulty: 3, desc: 'strict type check without emitting output' },
  { text: 'pnpm --filter @acme/web --filter @acme/api run --if-present build', category: 'npm', difficulty: 3, desc: 'build two workspace packages if they define it' },
  { text: 'npm ls react react-dom --all 2>/dev/null | grep -E "react(-dom)?@" | sort -u', category: 'npm', difficulty: 3, desc: 'hunt duplicate react copies in the tree' },
  { text: 'npx npm-check-updates -u --target minor && npm install && npm test', category: 'npm', difficulty: 3, desc: 'bump minor versions and verify nothing broke' },
  { text: 'node --inspect-brk=0.0.0.0:9229 node_modules/.bin/jest --runInBand --testTimeout=30000', category: 'npm', difficulty: 3, desc: 'debug tests serially with the inspector attached' },
  { text: 'npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN --location project', category: 'npm', difficulty: 3, desc: 'store a registry token in the project npmrc' },
  { text: 'NODE_OPTIONS=--max-old-space-size=8192 npm run build -- --analyze --out-dir dist/prod', category: 'npm', difficulty: 3, desc: 'memory-hungry build with bundle analysis' },
  { text: 'npx vitest run --coverage --coverage.thresholds.lines 80 --reporter=junit', category: 'npm', difficulty: 3, desc: 'ci test run enforcing a coverage floor' },
  { text: 'pnpm dlx turbo run build test lint --filter=...[origin/main] --cache-dir=.turbo', category: 'npm', difficulty: 3, desc: 'run pipeline tasks only for changed packages' },
]
