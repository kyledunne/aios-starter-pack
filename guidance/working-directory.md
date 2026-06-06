# The working / working-archive pattern

A simple way to organize active work inside an AIOS: a `working/`
folder that holds tasks currently in flight, and a `working-archive/`
folder they move into once finished. It keeps the live surface small
and current while leaving a dated breadcrumb trail of everything that
got done.

## Why have it

Most real tasks generate scratch material before they produce a
finished artifact — brainstorms, draft plans, intermediate files, notes
to self. Without a designated place for that material, it either
clutters the permanent parts of the repo or lives only in the chat
transcript, where it's lost the moment the session ends.

`working/` gives in-flight work a home. `working-archive/` keeps the
record without keeping the clutter: when a task is done, its folder
moves out of the live surface, so `working/` always shows only what's
actually active.

## The shape

```
working/                     # tasks in flight, one subfolder each
├── draft-q3-newsletter/
└── migrate-photo-library/

working-archive/             # finished tasks, filed by date
└── 2026/
    └── 05-may/
        └── 28-publish-press-release/
```

**One subfolder per task.** Anything with non-trivial scope gets its
own folder *before* work starts — brainstorms, plans, and scratch files
all live there together. Quick one-off edits don't need one; the
overhead isn't worth it for a five-minute change.

**Descriptive names.** Kebab-case, named for the task
(`draft-q3-newsletter`, not `task-3`). The archive prefixes each with
the day it was completed.

## Git is different here

`working/` is the one place that is **not** auto-committed. (See
[git-practices.md](git-practices.md) for the auto-commit default
everywhere else.) In-flight work stays uncommitted until the task is
wrapped up or the user asks to checkpoint — this is deliberately a
surface for live, half-formed thinking, and committing every
intermediate scribble would just be noise. Finished artifacts get
promoted to their permanent home or archived; the scratch around them
doesn't need to be preserved blow-by-blow.

## Wrapping up a task

When a task is done, the move out of `working/` is worth making a small
ritual — optionally a thin `/complete`-style skill that does it the
same way each time:

1. **Write a short overview** in the task folder (a `README.md`): a
   sentence or two on what the task was, a short list of what was
   actually done, and an inventory of the files left behind. High-level
   only — the git log carries the detail.
2. **Capture any reusable lessons** wherever the AIOS keeps them, so a
   problem that took real diagnosis isn't re-debugged next time.
3. **Move the folder** into `working-archive/<year>/<month>/<day>-<task-name>/`.
4. **Commit and push** — the archived task is now a coherent unit of
   work, so the normal auto-commit habit applies again.

The point is to keep `working/` small and current while leaving a clean,
dated trail in `working-archive/` of what got done, when, and how.

## Snag: a folder move fails with "in use" / "Device or resource busy"

Archiving a task means moving its folder, and that move can fail when an agent
runs inside the VS Code extension:

**Symptom.** A directory move or rename — Git Bash `mv`, PowerShell `Move-Item`,
or `git mv` — fails with `Device or resource busy` (Git Bash) or `Cannot move
item because the item ... is in use` (PowerShell). Retries don't clear it, and no
`python` / `git` / `bash` process is holding the path. Most likely on a large or
recently-written folder.

**Cause.** VS Code's file watcher keeps an open handle on workspace folders, and
that handle blocks the rename at the OS level. An agent running *inside* VS Code
can't release it — it can't close the editor it lives in.

**Fix.** Have the user move the folder manually (Explorer: select → Ctrl+X →
navigate → Ctrl+V), or **close VS Code first** to release the watcher, then move
it. Don't burn turns retrying programmatically — it won't clear while the watcher
holds the handle. Only directory **moves/renames** are blocked; **editing files**
inside the folder works fine throughout.

## Related: the local vault (raw external material)

`working/` is for the AIOS's own in-flight tasks. Raw, un-triaged material that
comes from *outside* — chat exports, Takeout archives, zip dumps, another
person's scrubbed export — is different: it's bulky, often private, and not yet
distilled into anything the repo should track. Stage it in a **gitignored
`references/local-vault/`** instead: a holding area that's never committed, from
which you promote the cleaned-up, non-sensitive keepers OUT into the tracked
repo. Keep a tracked `references/local-vault/README.md` documenting the
convention so it travels even though the contents don't.

## Implementation notes

This is a *pitch* for the pattern, not a copy of any one
implementation. The shape — two folders plus an optional wrap-up skill
— is simple, but the specifics (archive date format, what goes in the
wrap-up README, whether to bother with a skill at all) are personal
choices to make with the user when adopting it. Like everything in an
AIOS, add it when the need shows up: the day scratch files start piling
up in places they don't belong. (This pack ships the wrap-up as
`/complete-working-task`, with `/checkpoint-working-task` for mid-task
save-points.)
