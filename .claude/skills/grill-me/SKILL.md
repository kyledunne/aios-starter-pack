---
name: grill-me
description: Interview the user relentlessly about a plan, design, or topic — one question at a time, each with a recommended answer — checkpointing every answer to a capture file so nothing is lost as context fills up. Use when the user wants to stress-test a plan, get grilled on a design, run a brainstorm or discovery session, extract what's in their head into a doc, or says "grill me".
---

# Grill Me

Relentlessly interview the user about every aspect of the topic until you reach
shared understanding. Walk down each branch of the decision tree, resolving
dependencies one by one. The real goal is to **extract what's in their head into
a durable, organized Markdown file** so nothing is lost as context fills up.

## The capture file is the whole point

Long interviews fill up context. If you hold answers only in your head, you will
eventually misremember, conflate, or drop something. So you **checkpoint to disk
after every single answer**. The file, not your context, is the source of truth.
Never make the user ask you to save progress.

This durability is also what makes the **context checkpoints** below safe: because
everything said is already on disk, the user can `/compact` mid-interview and lose
nothing — you just re-read the file and continue.

## Setup (do this BEFORE the first question)

1. **Create the capture file inside a `working/` subfolder.** The AIOS keeps
   in-progress work in `working/`, one subfolder per task (see
   [`guidance/working-directory.md`](../../../guidance/working-directory.md)). Use
   `working/<topic-slug>/` and name the capture file descriptively — e.g.
   `working/<topic-slug>/grill-capture.md`. If the grill is part of an existing
   working task, drop the capture in that task's folder. Don't scatter captures
   elsewhere. (`working/` is the one place not auto-committed, so the capture
   stays local until the task is checkpointed or completed — which is fine;
   that's the live scratch surface.)
   - Get today's date if you don't already know it:
     `Get-Date -Format yyyy-MM-dd` (PowerShell) or `date +%F` (Bash).
2. **Create the file immediately** with a header: title, date, the goal of the
   session, a "Summary / key decisions" section, and an empty "Open flags"
   section.
3. **Tell the user where you're saving, and set the rhythm.** In one short
   message: name the capture file, say you'll ask one question at a time (each
   with a recommended answer), and that you'll **pause occasionally to let them
   `/compact`** so a long interview never quietly degrades as context fills.
   Then ask Q1.

## The checkpoint rule (non-negotiable)

After EVERY user answer, BEFORE you ask the next question:

- Append a structured entry to the capture file: the question topic, the key
  facts and decisions from their answer (in their words where the wording
  matters), and any flags (things they couldn't answer plus who should).
- Update or correct earlier entries if a later answer changes them.
- Only then ask the next question.

Never batch multiple answers into one write. Checkpoint one answer at a time. The
point is that if context is lost at any moment, the file already holds everything
said so far.

## Context checkpoints: let the user /compact

A long interview will fill the context window. The user **can't run `/compact`
while a question is pending** — they'd have to interrupt your question, compact,
and then remember to answer. So build natural stopping points into the rhythm:

- **When to offer one.** At a **topic boundary** (you've just finished a branch
  of the tree), or after **every few questions** — and sooner if the conversation
  is clearly getting long. Lean on **your own judgment**: when a chunk of work is
  banked and you sense the session is getting long, give them the opening and let
  them decide whether their context is full enough to compact.
- **Make it a standalone turn — no question attached.** This is the whole trick:
  a compact checkpoint is its *own* message with **no pending question**, so the
  user is free to run `/compact` right then. Say, in effect: "Good place to pause —
  everything so far is saved in `<capture file>`. If your context is getting
  full, run `/compact` now, then say *continue* and I'll pick up from the
  file. Otherwise, ready for the next question whenever you are." Never bundle the
  compact suggestion with the next question.
- **Resume losslessly.** After a `/compact`, when the user says continue,
  **re-read the capture file first**, then resume exactly where you left off. The
  file is the source of truth, so compaction costs nothing — that is the entire
  reason this skill writes everything down.

This matters most for **non-technical users**, who won't think to manage context
themselves. The checkpoints make a long, thorough interview comfortable instead
of something that quietly degrades as the window fills.

## Interview method

- Ask **one question at a time.** For each, provide your **recommended answer**
  (your best inference from context) so the user can simply confirm, correct, or
  redirect.
- Resolve dependencies in order: settle the upstream decision before the ones
  that depend on it.
- If a question can be answered by **exploring the codebase or reading a
  file/doc**, do that instead of asking. If the user hands you a doc, read it and
  only surface what's net-new.
- When the user **can't answer** something, capture it as a flag with the right
  owner and move on. Don't stall.
- Keep going until the user says you're done, or you've covered every branch.
  Offer a completeness backstop near the end ("anything we haven't touched?").

## Capture file structure

```
# {Topic}: Brainstorm / Discovery Notes
Date: {date} · Goal: {one line}

## Summary / key decisions
(running synthesis, updated as you go)

## Q&A log
### Q1 — {topic}
- Asked: {question}
- Captured: {facts, decisions, in their words where it matters}
- Flags: {open item -> owner}
...

## Open flags (pending input)
- {item} -> {who can answer}
```

## At the end

- Do a final read of the capture file for contradictions or gaps and reconcile
  them.
- Give the user a short recap: what's captured, what's still flagged, and the
  suggested next step. If the capture is the seed of a real deliverable (a plan,
  a spec, a map), note that it can graduate into its own `working/` artifact or
  permanent home.
