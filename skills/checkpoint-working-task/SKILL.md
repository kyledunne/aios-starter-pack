---
name: checkpoint-working-task
description: Checkpoint an in-flight working task when the user wants its current state synced.
---

# Checkpoint — save in-flight work without wrapping it up

`working/` is committed like the rest of the repo (see
[guidance/working-directory.md](../../../guidance/working-directory.md)), so
this skill is not the only way in-flight work reaches git — it's the
**deliberate save-point**: commit the current task folder *now*, at a
milestone you chose, with a message that says what the milestone was, and a
resume note to land on. Use it when you want a marked point to come back to, or
when nothing else is committing the repo for you. It **doesn't** archive or
write the full wrap-up overview. The task keeps going. But a checkpoint often
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

### 3. Commit

Commit just that folder. Suggested message:

```
checkpoint-working-task: <task-name>

<optional one-line note on where things stand>.
```

Outside Planet You, push to origin. Inside Planet You, don't push: Planet You
pushes on its own (see
[guidance/git-practices.md](../../../guidance/git-practices.md)). If the AIOS
folder is not a git repository, skip this step and tell the user the notes are
saved on this computer.

Don't archive, and don't touch other `working/` folders.

### 4. Confirm to the user

One line: that the folder is saved, and the task is still open.
Then stop.
