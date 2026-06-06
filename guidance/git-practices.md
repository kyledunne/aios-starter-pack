# Git practices for an AIOS

The whole point of an AIOS living in a git repo is that it's
version-controlled and synced across machines. Lean into that.

## Default: commit and push every coherent unit of change, automatically

When a unit of work in the AIOS is complete, **commit and push it
automatically, by default, without asking first.** Even small ones —
adding a single note to a scratchpad file is a complete unit and
should be committed and pushed on its own.

Keeping the AIOS committed and synced across machines is the whole
point of it being a repo, so this is the **normal habit**, not
something to confirm each time. Asking on every change creates
friction the user has to absorb, and the friction adds up fast across
a day of small captures, edits, and notes.

What makes a "coherent unit" is judgment. A rough heuristic: if the
state the repo is in *right now* is one you'd be happy to land back
on if you reverted, it's a unit. Don't bundle two unrelated changes
into one commit just because they happened in the same session.

## When to hold off and ask

A handful of cases where the automatic-commit default is wrong:

- **The change is mid-task / incomplete.** Part of a larger piece of
  in-progress work, not a standalone unit yet. Wait until it forms
  one.
- **The change is experimental and may need reverting.** A try, not a
  conclusion. Stage it locally, sit on it, and revisit before
  committing.
- **The change touches something sensitive or hard to undo.** A
  destructive operation, a file that holds credentials, a config
  change with broad side-effects. Stop and confirm with the user
  before committing or pushing.

Outside those cases, default to committing and pushing.

## Why this works

The AIOS grows in lots of tiny increments — a scratchpad note here, a
new connection logged there, a one-line edit to a context document.
Each of those is small but worth preserving on its own:

- **Synced across machines automatically.** Notes captured on a
  desktop appear on a laptop the next time the AIOS is opened there.
- **Granular history.** Every change is its own commit, so reverting
  or auditing later is precise.
- **No mental overhead.** The user doesn't need to remember to commit
  later or batch up a "wrap-up" routine at the end of a session.

## Commit messages

Short and direct. Describe what changed in one line. Multi-paragraph
messages are usually a sign that the unit isn't actually coherent —
split it.

## Multiple agents in one repo: keep commits scoped

Expect more than one agent working in the same AIOS at once. The git **index
(staging area) and HEAD are shared repo state**, not per-agent — so when two
agents share one working copy, their commits can bleed into each other:

- You stage your files, go to commit, and git says **"nothing to commit"** —
  your changes already landed in *another* agent's commit, under an unrelated
  message.
- Or the reverse: **your** commit includes files you never touched, because you
  staged broadly and scooped up another agent's in-flight work.

Separate **git worktrees** would give each agent its own index and avoid this
entirely, but they're awkward enough in practice that agents usually just share
one working copy — so the discipline below is the real defense:

- **One agent per `working/` project at a time.** Agents on *separate* projects
  rarely interfere; the same task folder is where they collide. Inside your own
  `working/<project>/` subfolder, commit freely — that's your sandbox.
- **Outside your subfolder, scope every commit by explicit pathspec:**
  `git commit -- path1 path2`, never `git add -A` / `git commit -a`. That keeps
  unrelated work out of *your* commit.
- **Don't leave files staged between steps.** The pathspec protects your commit's
  *contents*, but not your *staged files* from another agent's broad commit.
  Stage and commit in one motion — `git commit -- <paths>` commits the
  working-tree version of tracked paths with no separate `git add`, so there's no
  window where your changes sit staged for someone else to scoop. (New, untracked
  files still need `git add` first — chain it:
  `git add <new> && git commit -- <new> <others>` in one command to keep the
  window to milliseconds.)
- **If the bundling already happened and is pushed, leave it.** Don't rewrite
  history to split it — especially with a concurrent writer active, where a
  force-push turns a cosmetic problem into a real one. Verify your content is
  intact, note the bundling, and move on.
