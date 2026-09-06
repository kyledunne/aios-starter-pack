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
  one. (This is about *when* to commit, not *whether*: in-flight work in
  `working/` gets committed too — see
  [working-directory.md](working-directory.md).)
- **The change is experimental and may need reverting.** A try, not a
  conclusion. Stage it locally, sit on it, and revisit before
  committing.
- **The change touches something sensitive or hard to undo.** A
  destructive operation, a file that holds credentials, a config
  change with broad side-effects. Stop and confirm with the user
  before committing or pushing.

Outside those cases, default to committing and pushing.

## The exception: when something else is already committing

The default above assumes you are the only thing that commits this repo.
That holds in a terminal or editor session, and it is exactly why the
habit matters there — nothing else will get the work into git.

It does not hold in an AIOS opened through **Planet You**, whose Gravity
sync commits and pushes the whole repo at every turn edge and on a timer.
There, an agent's routine commits are duplicated effort: the work lands in
git within the minute whether or not a turn is spent on it. So:

- **Don't commit reflexively after each change.** Make the edit and move
  on; the sync takes it.
- **Deliberate commits are still fine.** Where a coherent unit genuinely
  deserves its own message — a finished piece of work, a milestone worth
  landing on — commit it. What to drop is the habit, not the act.

**How to tell which session you're in:** a `.planetyou/` folder at the repo
root means the space was scaffolded through Planet You and Gravity is
syncing it. No `.planetyou/`, no sync — the default applies in full.

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

## Multiple agents in one repo

Expect more than one agent working in the same AIOS at once. The git **index
(staging area) and HEAD are shared repo state**, not per-agent — so when two
agents share one working copy, their commits bleed into each other:

- You stage your files, go to commit, and git says **"nothing to commit"** —
  your changes already landed in *another* agent's commit, under an unrelated
  message.
- Or the reverse: **your** commit includes files you never touched, because you
  staged broadly and scooped up another agent's in-flight work.

Separate **git worktrees** would give each agent its own index and avoid this
entirely, but they're awkward enough in practice that agents usually just share
one working copy.

### The habit that matters: one agent per `working/` project

Agents on *separate* projects rarely interfere; the same task folder is where
they genuinely collide — two agents editing the same files, overwriting each
other's edits. **No commit discipline fixes that**, which is why this one is a
real rule and the rest of this section is not.

### Scoped commits: a courtesy, and when it's more than that

Scoping each commit to your own paths — `git commit -- path1 path2` rather than
`git add -A` / `git commit -a` — used to be a hard rule here. It has been
downgraded, honestly, because the reason for it has weakened:

- **If something is committing the repo automatically** — Planet You's Gravity,
  or any always-on sync process — then a neighbouring agent sweeping your files
  into its commit costs you nothing. Those files were going to be committed
  within the minute anyway, under someone's message. The bundling is cosmetic.
- **If nothing is** — a plain terminal or editor session on a machine with no
  such process — then the old reasoning still holds exactly as written, and
  scoping is what keeps another agent's half-done work out of your commit. Do
  it there.

Either way it produces tidier history, so it's worth doing when it's cheap:

- **Stage and commit in one motion.** `git commit -- <paths>` commits the
  working-tree version of tracked paths with no separate `git add`, so there's
  no window where your changes sit staged for someone else to scoop. New,
  untracked files still need `git add` first — chain it:
  `git add <new> && git commit -- <new> <others>` in one command.
- **If the bundling already happened and is pushed, leave it.** Don't rewrite
  history to split it — especially with a concurrent writer active, where a
  force-push turns a cosmetic problem into a real one. Verify your content is
  intact, note the bundling, and move on.
