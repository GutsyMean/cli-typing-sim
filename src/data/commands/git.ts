import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const git: CommandEntry[] = [
  // tier 1
  { text: 'git status', category: 'git', difficulty: 1, desc: 'show the working tree status' },
  { text: 'git add .', category: 'git', difficulty: 1, desc: 'stage every change in the current directory' },
  { text: 'git commit -m "fix typo"', category: 'git', difficulty: 1, desc: 'commit staged changes with a message' },
  { text: 'git push', category: 'git', difficulty: 1, desc: 'upload local commits to the remote' },
  { text: 'git pull', category: 'git', difficulty: 1, desc: 'fetch and merge changes from the remote' },
  { text: 'git log --oneline', category: 'git', difficulty: 1, desc: 'compact one-line-per-commit history' },
  { text: 'git diff', category: 'git', difficulty: 1, desc: 'show unstaged changes in the working tree' },
  { text: 'git branch', category: 'git', difficulty: 1, desc: 'list local branches' },
  { text: 'git checkout main', category: 'git', difficulty: 1, desc: 'switch to the main branch' },
  { text: 'git switch -c feature/login', category: 'git', difficulty: 1, desc: 'create and switch to a new branch' },
  { text: 'git fetch', category: 'git', difficulty: 1, desc: 'download remote refs without merging' },
  { text: 'git stash', category: 'git', difficulty: 1, desc: 'shelve uncommitted changes for later' },
  { text: 'git stash pop', category: 'git', difficulty: 1, desc: 'reapply the most recent stash and drop it' },
  { text: 'git clone https://github.com/user/repo.git', category: 'git', difficulty: 1, desc: 'copy a remote repository locally' },
  { text: 'git init', category: 'git', difficulty: 1, desc: 'create an empty repository here' },
  { text: 'git merge develop', category: 'git', difficulty: 1, desc: 'merge another branch into the current one' },
  // tier 2
  { text: 'git rebase -i HEAD~3', category: 'git', difficulty: 2, desc: 'interactively rewrite the last 3 commits' },
  { text: 'git commit --amend --no-edit', category: 'git', difficulty: 2, desc: 'add staged changes to the last commit' },
  { text: 'git log --graph --oneline --all', category: 'git', difficulty: 2, desc: 'draw the full branch history as a graph' },
  { text: 'git push -u origin feature/login', category: 'git', difficulty: 2, desc: 'push a branch and set its upstream' },
  { text: 'git reset --hard origin/main', category: 'git', difficulty: 2, desc: 'discard local work and match the remote' },
  { text: 'git cherry-pick abc1234', category: 'git', difficulty: 2, desc: 'apply one commit onto the current branch' },
  { text: 'git diff --staged', category: 'git', difficulty: 2, desc: 'show what is about to be committed' },
  { text: 'git branch -d feature/old', category: 'git', difficulty: 2, desc: 'delete a fully merged branch' },
  { text: 'git remote add origin git@github.com:user/repo.git', category: 'git', difficulty: 2, desc: 'connect a local repo to a remote' },
  { text: 'git tag -a v1.2.0 -m "release 1.2.0"', category: 'git', difficulty: 2, desc: 'create an annotated release tag' },
  { text: 'git blame -L 10,20 src/app.ts', category: 'git', difficulty: 2, desc: 'who last touched lines 10 through 20' },
  { text: 'git revert HEAD', category: 'git', difficulty: 2, desc: 'undo the last commit with a new commit' },
  { text: 'git clean -fd', category: 'git', difficulty: 2, desc: 'remove untracked files and directories' },
  { text: 'git show HEAD~2 --stat', category: 'git', difficulty: 2, desc: 'summary of a commit two steps back' },
  { text: 'git config --global user.email "dev@example.com"', category: 'git', difficulty: 2, desc: 'set your commit email everywhere' },
  { text: 'git restore --staged src/app.ts', category: 'git', difficulty: 2, desc: 'unstage a file without losing edits' },
  // tier 3
  { text: 'git log --pretty=format:"%h %an %ar %s" --since="2 weeks ago" -- src/', category: 'git', difficulty: 3, desc: 'custom-formatted recent history for one path' },
  { text: 'git log --all --grep="hotfix" --author="alice" --oneline --since=2025-01-01', category: 'git', difficulty: 3, desc: 'search history by message, author, and date' },
  { text: 'git clone --depth 1 --branch v2.1.0 https://github.com/org/monorepo.git ./vendor/mono', category: 'git', difficulty: 3, desc: 'shallow-clone a single tag into a directory' },
  { text: 'git for-each-ref --sort=-committerdate --format="%(refname:short)" refs/heads/', category: 'git', difficulty: 3, desc: 'list branches by most recent commit' },
  { text: 'git worktree add ../hotfix-2.4 -b hotfix/2.4.1 origin/release-2.4', category: 'git', difficulty: 3, desc: 'new branch in a separate working directory' },
  { text: 'git push origin --delete feature/stale && git branch -D feature/stale', category: 'git', difficulty: 3, desc: 'delete a branch remotely and locally' },
  { text: 'git stash push -m "wip: auth refactor" -- src/auth/ tests/auth/', category: 'git', difficulty: 3, desc: 'stash only specific paths with a label' },
  { text: 'git bisect start HEAD v1.8.0 && git bisect run npm test', category: 'git', difficulty: 3, desc: 'auto-hunt the commit that broke the tests' },
  { text: 'git archive --format=tar.gz --prefix=app-1.0/ -o app-1.0.tar.gz v1.0.0', category: 'git', difficulty: 3, desc: 'export a tagged tree as a tarball' },
  { text: 'git shortlog -sn --no-merges --since="1 month ago" -- src/', category: 'git', difficulty: 3, desc: 'commit counts per author for one path' },
  { text: 'git fetch origin && git reset --hard origin/main && git clean -fdx', category: 'git', difficulty: 3, desc: 'nuke local state to exactly match the remote' },
  { text: 'git config --global alias.lg "log --graph --abbrev-commit --decorate --oneline"', category: 'git', difficulty: 3, desc: 'save a pretty log as a permanent alias' },
  { text: 'git rebase --onto main feature/base feature/child', category: 'git', difficulty: 3, desc: 'transplant a branch onto a new base' },
]
