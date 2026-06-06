---
name: checkpoint-working-task
description: Save a mid-task snapshot of in-flight work — commit + push the current `working/` task folder without wrapping it up or archiving. Use when the user wants to checkpoint progress so it syncs across machines, while the task is still going.
---

# Checkpoint — save in-flight work without wrapping it up

`working/` is the one place that is **not** auto-committed (see
[guidance/working-directory.md](../../../guidance/working-directory.md)), so
in-flight scratch normally stays uncommitted until a task is done. This skill
is the deliberate save-point in between: commit + push the current task folder
so progress is backed up and synced across machines, **without** archiving or
writing the full wrap-up overview. The task keeps going. But a checkpoint often
exists precisely so the task can be paused and resumed later — or picked up on a
different machine — so make sure there's a **light resume note** to land on
(step 2).

Think of it as the lightweight sibling of
[`/complete-working-task`](../complete-working-task/SKILL.md):
`/checkpoint-working-task` saves, `/complete-working-task` wraps up and archives.

## Steps

### 1. Identify the task folder

Confirm which subfolder of `working/` to checkpoint. If the user didn't name it,
infer from what we were just working on and verify in one sentence.

### 2. Make sure there's a light resume note

If the task folder already has a README (or other notes that capture where
things stand), leave it as-is. If it has **none**, write a short README — just
enough to resume cold from another machine or after a break: one or two lines on
what the task is, where it currently stands, and the next concrete step.

Keep it light — this is a sticky note, not the finished overview that
`/complete-working-task` writes. Don't document the whole task, restructure the
folder, or log snags; that's wrap-up work, and the task isn't done.

### 3. Commit and push

Stage just that folder, commit, and push to origin. Suggested message:

```
checkpoint-working-task: <task-name>

<optional one-line note on where things stand>.

Co-Authored-By: <Claude attribution>
```

Don't archive, and don't touch other `working/` folders.

### 4. Confirm to the user

One line: that the folder is committed and pushed, and the task is still open.
Then stop.
