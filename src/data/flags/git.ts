import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // git commit
  { tool: 'git commit', flag: '-m', desc: 'commit message inline', category: 'git', difficulty: 1 },
  { tool: 'git commit', flag: '-a', desc: 'stage all tracked, modified files before committing', category: 'git', difficulty: 1 },
  { tool: 'git commit', flag: '--amend', desc: 'rewrite the previous commit with the staged changes', category: 'git', difficulty: 1 },
  { tool: 'git commit', flag: '--no-edit', desc: 'keep the existing commit message without opening the editor', category: 'git', difficulty: 2 },
  // git log
  { tool: 'git log', flag: '--oneline', desc: 'one compact line per commit', category: 'git', difficulty: 1 },
  { tool: 'git log', flag: '--graph', desc: 'draw an ascii graph of branch and merge history', category: 'git', difficulty: 2 },
  { tool: 'git log', flag: '--all', desc: 'show commits from all refs, not just the current branch', category: 'git', difficulty: 2 },
  { tool: 'git log', flag: '--since', desc: 'only commits newer than the given date', category: 'git', difficulty: 2 },
  { tool: 'git log', flag: '--grep', desc: 'only commits whose message matches the pattern', category: 'git', difficulty: 2 },
  { tool: 'git log', flag: '--author', desc: 'only commits by a matching author', category: 'git', difficulty: 2 },
  { tool: 'git log', flag: '-p', desc: 'show the patch (diff) introduced by each commit', category: 'git', difficulty: 2 },
  // branching & switching
  { tool: 'git switch', flag: '-c', desc: 'create the branch and switch to it', category: 'git', difficulty: 1 },
  { tool: 'git checkout', flag: '-b', desc: 'create the branch and check it out', category: 'git', difficulty: 1 },
  { tool: 'git branch', flag: '-d', desc: 'delete a fully merged branch', category: 'git', difficulty: 1 },
  { tool: 'git branch', flag: '-D', desc: 'force-delete a branch even if unmerged', category: 'git', difficulty: 2 },
  // rebase
  { tool: 'git rebase', flag: '-i', desc: 'interactive rebase: edit, squash, reorder commits', category: 'git', difficulty: 2 },
  { tool: 'git rebase', flag: '--onto', desc: 'replay commits onto a different base', category: 'git', difficulty: 3 },
  { tool: 'git rebase', flag: '--continue', desc: 'resume the rebase after resolving conflicts', category: 'git', difficulty: 2 },
  // push / pull / fetch
  { tool: 'git push', flag: '-u', desc: 'set the upstream tracking branch while pushing', category: 'git', difficulty: 1 },
  { tool: 'git push', flag: '--delete', desc: 'delete the named ref on the remote', category: 'git', difficulty: 2 },
  { tool: 'git push', flag: '--force-with-lease', desc: 'force-push only if the remote has not moved', category: 'git', difficulty: 2 },
  { tool: 'git pull', flag: '--rebase', desc: 'rebase local commits on top of the fetched branch', category: 'git', difficulty: 2 },
  { tool: 'git fetch', flag: '--prune', desc: 'remove remote-tracking refs deleted on the remote', category: 'git', difficulty: 2 },
  // reset / restore / diff / status
  { tool: 'git reset', flag: '--hard', desc: 'discard all local changes, matching the given commit', category: 'git', difficulty: 1 },
  { tool: 'git restore', flag: '--staged', desc: 'unstage the file, keeping working tree changes', category: 'git', difficulty: 1 },
  { tool: 'git diff', flag: '--staged', desc: 'diff what is staged against the last commit', category: 'git', difficulty: 1 },
  { tool: 'git diff', flag: '--name-only', desc: 'list only the names of changed files', category: 'git', difficulty: 2 },
  { tool: 'git status', flag: '-s', desc: 'short two-column status output', category: 'git', difficulty: 2 },
  // tags
  { tool: 'git tag', flag: '-a', desc: 'create an annotated tag object', category: 'git', difficulty: 2 },
  { tool: 'git tag', flag: '-m', desc: 'tag annotation message inline', category: 'git', difficulty: 2 },
  // misc porcelain
  { tool: 'git blame', flag: '-L', desc: 'annotate only the given line range', category: 'git', difficulty: 3 },
  { tool: 'git clean', flag: '-fd', desc: 'force-remove untracked files and directories', category: 'git', difficulty: 2 },
  { tool: 'git clean', flag: '-fdx', desc: 'force-remove untracked files, directories and ignored files', category: 'git', difficulty: 3 },
  { tool: 'git show', flag: '--stat', desc: 'show a diffstat summary instead of the full patch', category: 'git', difficulty: 2 },
  { tool: 'git config', flag: '--global', desc: 'read or write the per-user config file', category: 'git', difficulty: 1 },
  { tool: 'git clone', flag: '--depth', desc: 'shallow clone with only that many commits of history', category: 'git', difficulty: 2 },
  { tool: 'git clone', flag: '--branch', desc: 'check out this branch or tag instead of the default', category: 'git', difficulty: 2 },
  { tool: 'git remote', flag: '-v', desc: 'show remote names with their fetch and push urls', category: 'git', difficulty: 1 },
  { tool: 'git merge', flag: '--no-ff', desc: 'always create a merge commit, even when fast-forward is possible', category: 'git', difficulty: 2 },
  { tool: 'git add', flag: '-p', desc: 'interactively pick hunks to stage', category: 'git', difficulty: 2 },
  { tool: 'git stash', flag: '-m', desc: 'message describing the stash entry', category: 'git', difficulty: 2 },
  // plumbing-ish / power tools
  { tool: 'git for-each-ref', flag: '--sort', desc: 'sort refs by the given field key', category: 'git', difficulty: 3 },
  { tool: 'git for-each-ref', flag: '--format', desc: 'output template using %(field) placeholders', category: 'git', difficulty: 3 },
  { tool: 'git worktree', flag: '-b', desc: 'create a new branch checked out in the new worktree', category: 'git', difficulty: 3 },
  { tool: 'git archive', flag: '--format', desc: 'archive format to produce, e.g. tar.gz or zip', category: 'git', difficulty: 3 },
  { tool: 'git archive', flag: '--prefix', desc: 'prepend this path prefix to every file in the archive', category: 'git', difficulty: 3 },
  { tool: 'git archive', flag: '-o', desc: 'write the archive to this file', category: 'git', difficulty: 3 },
  { tool: 'git shortlog', flag: '-sn', desc: 'commit count per author, sorted by count', category: 'git', difficulty: 3 },
  { tool: 'git shortlog', flag: '--no-merges', desc: 'exclude merge commits from the summary', category: 'git', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
