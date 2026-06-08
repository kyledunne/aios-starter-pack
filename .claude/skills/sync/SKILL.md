---
name: sync
description: Bring this machine's copy of the AIOS up to date — `git pull` from GitHub (and push any local commits), safely handling uncommitted work and merge conflicts so nothing is lost. Use when the user wants to sync, get up to date, or pull the latest before starting work.
---

# Sync — get this AIOS up to date

The AIOS is a git repo that lives on GitHub and is synced across every machine
it runs on. `/sync` brings *this* copy up to date — pulls down whatever changed
elsewhere, and pushes up any local commits that haven't gone out yet — so the
user can start work knowing they're current.

It's built to be safe for a non-technical user: just type `/sync` and let Claude
handle the git. Two promises hold no matter what: **nothing done locally gets
lost**, and **the repo is never left in a broken half-merged state**.

## Steps

### 1. See where things stand

Fetch the latest refs and take stock — don't change anything yet:

```
git fetch
git status --short --branch
```

Read off three things:

- **Clean working tree, or uncommitted changes?** Uncommitted changes are almost
  always live `working/` scratch — deliberately left uncommitted (see
  [guidance/working-directory.md](../../../guidance/working-directory.md)). They
  must be preserved.
- **Behind, ahead, or diverged** from `origin/main`? *Behind* = the remote has
  commits this copy doesn't (the normal case). *Ahead* = there are local commits
  not yet pushed. *Diverged* = both.
- **No remote / no upstream?** Then there's nothing to sync against — say so and
  stop.

### 2. Get up to date

Pick the case:

- **Already up to date, nothing local to push** → say so; done.
- **Behind, clean working tree** → the common case. Fast-forward:
  ```
  git pull --ff-only
  ```
- **Uncommitted changes present** → stash them (new files included), pull, then
  put them back:
  ```
  git stash push -u -m "sync"
  git pull --ff-only          # or a merge if history diverged — see below
  git stash pop
  ```
  A clean `pop` means the in-progress work is back exactly as it was. Don't
  commit the scratch just to make the pull go through — stash it.
- **Diverged history** (local commits *and* remote commits) → merge them
  (stash first if the tree is also dirty):
  ```
  git pull --no-rebase
  ```
  A merge has a clean abort if it goes wrong; a rebase doesn't — which is why
  merge is the default here.

### 3. If there's a conflict

A conflict means the same lines changed in two places. Two rules govern what
happens next:

1. **Never lose the user's work.**
2. **Never leave the repo half-merged** — either finish the merge or abort it.

Resolve the **obvious** ones yourself. Most AIOS conflicts are two machines
*both adding* different things — two new memory files, two appends to the
scratchpad, both editing an index file. There's no real contradiction: keep both
sides, drop the conflict markers, and complete the merge.

If it's a **genuine** conflict — the same value changed two different ways, where
keeping both makes no sense — don't guess. Back the repo out to exactly where it
started, then ask the user which they want:

- mid-merge → `git merge --abort`
- a failed `stash pop` → the stash stays in the list on conflict, so discard the
  half-applied result, leaving the stash to re-apply once it's sorted.

Then explain the conflict in plain language and let them decide.

### 4. Push local commits

If step 1 showed local commits not yet on the remote (you were *ahead* or
*diverged*), push them now:

```
git push
```

This is the user's own already-committed work going up — safe. (Don't commit
uncommitted `working/` scratch just to push it; that stays local until its task
is checkpointed or wrapped.)

### 5. Report plainly

A non-technical user ran this — keep the summary in plain language:

- what came down ("pulled 3 changes from your other machine — updated the June
  sprint and two notes"),
- what went up, if anything,
- that any in-progress work is untouched,
- and anything needing their attention (a conflict you couldn't safely resolve).

Then stop.

## What not to do

- **Don't discard uncommitted changes to force a pull through** — no
  `git reset --hard`, `git checkout -- .`, or `git clean` on a dirty tree. Stash
  instead.
- **Don't commit `working/` scratch** just to get the pull through.
- **Don't force-push or rewrite history** to resolve a divergence.
- **Don't leave a conflicted or half-merged tree.** Finish it or abort it — never
  walk away mid-merge.
- **Don't `git add -A` / `-a`.** Other agents may share this working copy, so
  keep any commit you make (e.g. completing a merge) scoped — see
  [guidance/git-practices.md](../../../guidance/git-practices.md).
