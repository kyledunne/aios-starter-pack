---
name: dream
description: Tend the memory store the way sleep consolidates memory — sweep every file in `memory/`, repair what's broken (bad frontmatter, stale paths, dangling `[[links]]`, relative dates), reconcile contradictions, prune what's genuinely no longer relevant, and resync MEMORY.md. Use when the user wants to clean up / consolidate / fix memories — and (later) as the engine the nightly `autodream` automation will run.
---

# Dream — consolidate and repair the memory store

Sleep is when a brain replays the day, files what matters, repairs what
got garbled, and lets go of what doesn't. This skill does the same for the
AIOS's [`memory/`](../../../memory/) — it reads every memory, **fixes what's
broken, out-of-date, or inconsistent, and removes what's no longer
relevant**, then commits the result. The commit *is* the audit trail and
the undo: nothing is ever truly lost, because every change is reviewable
and revertible in git history.

Dreaming is **consolidation and repair, never growth.** It never invents
new memories or pads existing ones. If anything, a healthy dream tends to
*shrink* the store. Touch only what's actually wrong — preserve each
memory's author, voice, and content. A clean store should come out
unchanged.

## What a healthy memory looks like

These are the invariants every pass checks against. (They mirror the memory
spec in the harness; restated here so this skill is self-contained.)

- **One file = one fact**, in `memory/<slug>.md`, with frontmatter:
  `name` (matches the filename slug), `description` (a one-line hook), and
  `metadata.type` ∈ `user` | `feedback` | `project` | `reference`.
  (Auto-created files also carry harmless `node_type` / `originSessionId`
  keys — leave those alone; they are not errors.)
- **`feedback` and `project`** memories carry a `**Why:**` line and a
  `**How to apply:**` line. `user` / `reference` usually don't need them.
- **Dates are absolute** ("2026-06-04"), never relative ("yesterday",
  "last week") — relative dates rot the moment they're written.
- **Cross-links use `[[slug]]`** and resolve to a real memory's `name`.
  (A `[[slug]]` with no file yet is *allowed* — it's a placeholder for a
  memory worth writing — but a link to a slug that was **renamed or
  deleted** is broken and should be repaired.)
- **MEMORY.md is a bijection with the files:** every memory file (except
  MEMORY.md itself) has exactly one index line, every index line points to
  an existing file, and each line's hook matches the memory's current
  content.
- **Claims about the repo are true:** paths, skill names, and automation
  folders a memory names still exist at the names it gives.
- **No two memories contradict each other; no exact duplicates.**

## Steps

### 1. Inventory

List every `*.md` in [`memory/`](../../../memory/), read `MEMORY.md`, and
read each memory file. Hold the whole store in context at once — dreaming
is cross-cutting work; you can't reconcile contradictions or spot
duplicates one file at a time.

### 2. Pass 1 — structural integrity (safe repairs)

Mechanical, low-risk fixes. Apply these directly:

- **Filename ↔ `name` mismatch** → rename the file (`git mv`) or fix the
  `name:` so they agree on the slug.
- **MEMORY.md drift** → add a missing index line for an un-indexed file;
  remove a dangling line that points to no file; fix a wrong link target.
- **Dangling `[[links]]`** → repoint links whose target slug was renamed.
  Leave forward-placeholder links — ones that name a memory worth writing
  but not yet written — as they are.
- **Malformed / missing frontmatter** → repair `name` / `description` /
  `metadata.type`. If `type` is one of the four but `feedback`/`project` is
  missing its `**Why:**` / `**How to apply:**`, add them only if the body
  already says enough to fill them; otherwise just flag it.
- **Relative dates** → convert to absolute using the memory's own context
  or its git history (`git log --diff-filter=A -- memory/<file>` for when it
  was created). If a relative date can't be pinned, flag it rather than
  guessing.

Do **not** normalize cosmetic differences (frontmatter key order, the
`node_type`/`originSessionId` extras, prose style). That's churn, not
repair.

### 3. Pass 2 — freshness (verify against reality)

For each memory, test its concrete, checkable claims against the current
repo:

- **Paths and names it cites** — does `automations/<x>/` still exist? does
  the skill it references live at `skills/<name>/SKILL.md`? was a folder it
  names moved or renamed (check `git log` for the rename)? Update the memory
  to the current location/name when the move is unambiguous.
- **Status markers** — "not yet armed", "v1 / review mode", "DONE", "poller
  not yet built". If the repo now contradicts the marker (the file it said
  was missing now exists; the thing it said was pending is shipped), update
  the marker to match reality.
- **Cross-memory consistency** — when two memories state the same fact, make
  sure they agree.

Verification is **repo-internal only.** Don't try to confirm external
claims (Drive IDs, URLs, third-party state) — that needs live connections,
is slow and fragile, and must never run unattended. For an external claim
that looks wrong, flag it for an interactive check; don't act on it blind.

### 4. Pass 3 — consolidate and prune (judgment)

The careful pass. Two operations, each gated on a **stated reason**:

**Merge** — when two memories are duplicates or one is a subset of the
other, fold them into the stronger one (keep the better slug, union the
content, repoint every `[[link]]` and index line to the survivor), then
remove the loser.

**Remove** — delete a memory only when you can write down *why* in one
sentence, and it clears this bar:

- the thing it described is **fully gone and won't recur**, *and* it holds
  no reusable principle (a transient status note, not a durable lesson); or
- it's a **duplicate / subset** already merged above; or
- it's been **proven wrong or superseded** by another memory.

**Not** grounds for removal: merely old; a *completed* project (its
decisions and principles are often still live context — e.g. a "philosophy"
memory keeps governing future work after its project ships); or a vague
"feels stale." When you can't state a clean reason, **flag, don't delete** —
surface it in the report for the user instead of removing it.

This is the pass most able to do harm, so lean conservative. Git is the
undo, but the goal is a store the user trusts, not a tidy one.

### 5. Resync MEMORY.md

After all edits, make the index a faithful mirror: one line per surviving
memory, `- [Title](slug.md) — hook`, with each hook matching the memory's
current content. Drop lines for removed/merged memories; add lines for any
created by a rename.

### 6. Commit and push

One commit, scoped to the memory store **by explicit pathspec** (never
`git add -A` — other agents may be working; see the concurrent-agent commit
hygiene note in [guidance/git-practices.md](../../../guidance/git-practices.md)):

```
git commit -- memory/
```

The commit message is the dream's report — itemize every change so the user
can scan and revert any single one:

```
dream: consolidate + repair memory store

- repair: repointed [[old-slug]] → [[new-slug]] in <memory>
- freshen: updated stale paths in 2 memories
- prune: removed <slug> — <one-line reason>
- index: resynced MEMORY.md

Co-Authored-By: <Claude attribution>
```

Then push. If the dream changed nothing — a healthy store — **make no
commit**; say so and stop.

### 7. Report

A short summary: how many memories swept, what was repaired/freshened,
what was merged or pruned (with reasons), anything flagged for the user's
judgment, and that the commit is pushed. Then stop.

## What not to do

- Do **not** grow the store. Dreaming never invents memories or expands
  ones that are fine. Consolidate and repair; if in doubt, shrink.
- Do **not** rewrite for style. Fix what's broken, stale, or contradictory
  — leave voice, structure, and correct content untouched.
- Do **not** delete on a hunch. Removal needs a one-sentence reason that
  clears the bar in step 4. When unsure, flag for the user, don't delete.
- Do **not** normalize cosmetic frontmatter or chase external/Drive state
  unattended. Both are noise (or risk) for no real gain.
- Do **not** skip the commit's itemized report — the per-change log is what
  makes an unattended dream safe to trust and trivial to revert.

## Later: the `autodream` automation

This skill is the **engine**; `autodream` will be the **scheduled front
door** that runs it every night while the user sleeps — the same skill ↔
automation pairing described in [AGENTS.md](../../../AGENTS.md) (a `/skill`
is the agent's front door; an `automations/<name>/` folder is the engine
that runs unattended). When it's built it lives at `automations/autodream/`
with its own runner and ops doc. It isn't built yet — and per **Minimalism**,
it shouldn't be until running `/dream` by hand a few times proves the dream
pass is safe to trust unattended. The conservative posture above (high
removal bar, flag-don't-delete, git as the undo, itemized commit report) is
exactly what makes that eventual hand-off safe.
