---
name: dream
description: Consolidate and repair `memory/` when the user asks to clean up, reconcile, or prune cross-session memory.
---

# Dream

Sweep the repo-backed `memory/` store, repair its structure and truthfulness,
relocate facts that do not belong in ambient context, and resync `MEMORY.md`.
This is memory-only maintenance; use `/clean-up-aios` for a whole-repo pass.

## Memory admission test

A memory belongs here only when it should shape behavior across unrelated
sessions. Project state, tool setup, troubleshooting, research, and plans belong
in their own durable documentation and should be linked rather than loaded
ambiently. Keep one fact per file and treat roughly 10–15 memories as an
advisory review trigger, not a hard limit.

## 1. Inventory

Read `MEMORY.md` and every sibling Markdown file. Record the starting count and
inspect frontmatter, links, dates, duplication, contradictions, and concrete
claims about the repository.

## 2. Repair structure

- Make each filename match its frontmatter `name`.
- Require a concise description and a valid memory type used by the local
  harness.
- Convert relative dates to defensible absolute dates; flag rather than guess.
- Repair renamed or deleted `[[links]]`.
- Make `MEMORY.md` a bijection: one entry per file and no dangling entries.

Do not normalize harmless formatting or rewrite correct prose for style.

## 3. Verify freshness

Check repo-internal paths, skill names, automation names, and status claims
against current files and git history. For external facts that appear stale,
flag them for interactive verification rather than changing them on assumption.

## 4. Relocate, merge, or prune

For each memory, apply the admission test:

- **Relocate** project-specific or subsystem detail into the appropriate
  project, integration, reference, plan, or troubleshooting document. Fold it
  into that document's house style rather than transplanting the memory file.
- **Merge** exact duplicates or subset facts into the stronger survivor and
  repoint links.
- **Remove** only a transient fact that is fully gone, a duplicate already
  merged, or something proven wrong/superseded.

State a one-sentence reason for every merge, relocation, or removal. Age alone
is not a reason. When unsure, flag it for the user.

## 5. Resync and verify

Rewrite `MEMORY.md` as a short index of surviving facts. Re-run the count,
frontmatter, index, and link checks. Confirm that every relocated fact exists in
its destination before deleting its memory file.

## 6. Save and report

In a terminal or editor session, commit and push the coherent memory change set
using the repository's git guidance. If the AIOS is open in an app that already
syncs it, leave routine committing to that mechanism. Make no commit when
nothing changed.

Report the number of memories swept, repaired, relocated, merged, or pruned;
name the reasons and destinations; and surface anything needing judgment.

## Boundaries

- Do not invent or pad memories.
- Do not chase external state unattended.
- Do not delete on a hunch.
- Do not turn this into a whole-repository cleanup; that is `/clean-up-aios`.
