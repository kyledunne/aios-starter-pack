---
name: complete-working-task
description: Wrap up a finished task — write a short overview README, log any non-trivial snags hit during the work, archive the task folder under working-archive/YYYY/MM-month/DD-task-name/, and commit + push. Use when the user wants to complete, finish, wrap up, close out, or archive a task in `working/`, or says a working task is done.
---

# Complete — wrap up and archive a finished task

Use this when a task in `working/` is done and the user is ready to wrap it up.
The skill records the result, captures lessons learned, and moves the folder out
of the live working surface into the dated archive.

The point is to keep `working/` small and current, while leaving a clean
breadcrumb trail in `working-archive/` of what got done, when, and how —
plus capturing any reusable lessons so we don't re-debug the same problem
twice.

## Steps

### 1. Identify the task folder

Confirm which subfolder of `working/` this `/complete-working-task` applies to. If the user's
invocation didn't name it explicitly, infer from context (what we were just
working on) and verify with them in one sentence before proceeding.

If the work happened *without* a `working/` subfolder — i.e. we skipped the
convention — create the folder retroactively, move any in-flight scratch
files into it, and proceed. This is fine for the first runs of `/complete-working-task`
while the convention is still being adopted.

### 2. Write the overview README

In the task folder, write or update `README.md` with a **high-level**
summary. Two short sections is the usual shape:

```markdown
# <Task name in sentence case>

**Completed:** YYYY-MM-DD

<1–3 sentences on what the task was and why it mattered.>

## What was done

<A short numbered list — 3 to 7 bullets — of the steps actually taken.
Cross-link any commits, PRs, or files produced outside this folder.>

## Artifacts

<Bulleted inventory of the files left in this folder, with a one-line
description each.>
```

What to leave **out**: blow-by-blow debugging, dead ends, every commit hash,
intermediate decisions that got reversed. The future reader should be able to read
this in 30 seconds and know what happened. The git log carries the detail.

### 3. Log any non-trivial snags

Look back over the session and identify any problems that took **real
diagnosis** to figure out — not obvious typos or one-line fixes. The test:
*if this happened again months from now, would having it written down save
meaningful time?*

For each one that passes, write it down in the **right place**, per the
*When something breaks, write it down* convention in
[AGENTS.md](../../../AGENTS.md):

- **One tool, service, or skill** → that tool's file in
  `tools-and-connections/`, the relevant doc in [`guidance/`](../../../guidance/)
  (a *Troubleshooting* section or inline at the step), or the relevant skill file.
- **General / cross-cutting** → an `issues-and-solutions/` file (create the
  folder if this is the first such snag), symptom-first then the fix.
- **Machine-specific** → `local-setup.md`.

Capture both the **symptom** (so a future reader recognises the problem from
the outside before knowing the cause) and the resolution. Keep it concise.

Skip this step entirely if nothing in the session meets the bar. Most tasks
won't have one. Don't manufacture entries just to fill the section.

### 4. Move the folder to the archive

Compute the destination path from today's date:

```
working-archive/<YYYY>/<MM>-<month-name>/<DD>-<task-folder-name>/
```

Examples:
- `working-archive/2026/05-may/28-publish-quarterly-press-release/`
- `working-archive/2026/06-june/03-import-notes/`

Use lowercase month names. Two-digit day with leading zero. Create the
year and month directories if they don't exist yet.

Use `git mv` to move the folder so git tracks it as a rename rather than a
delete + add — that preserves history of any tracked files inside. Files
that were untracked just come along as a regular directory move.

If the move fails with `Device or resource busy` / `item is in use`, VS Code's
file watcher has the folder locked — see the VS Code folder-lock note in
[`guidance/working-directory.md`](../../../guidance/working-directory.md)
(have the user move it manually, then resume from step 5).

### 5. Commit and push

Stage the moved folder (now at its archive path), any snag notes written in
step 3, and any other AIOS-repo files the task happened to leave dirty that
are part of the natural commit.

One commit. Suggested message form:

```
complete-working-task: <task-name>

<one-sentence recap of what the task accomplished>.

Archived to working-archive/YYYY/MM-month/DD-task-name/.

Co-Authored-By: <Claude attribution>
```

Push to origin.

### 6. Confirm to the user

One sentence: where the folder ended up, whether any snags were logged (and
where), and that the commit is pushed. Then stop.

## What not to do

- Do **not** write a verbose README. The point is to skim it in 30 seconds
  in a year. If it's longer than the typical SKILL.md, it's too long.
- Do **not** log every minor friction as a snag. The bar is "would save
  real time the next time it happens." A wrong path typo doesn't qualify;
  a non-obvious tool gotcha with a specific symptom does.
- Do **not** delete files from the task folder during archive. The whole
  point is to preserve the working surface as-was, in case it's useful
  reference later. If something doesn't belong, that's a conversation with
  the user, not a silent cleanup.
- Do **not** auto-trigger `/complete-working-task` from elsewhere. It runs when the user
  invokes it, not when Claude judges a task done.
