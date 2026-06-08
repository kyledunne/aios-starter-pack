---
name: first-time-setup
description: "First-machine on-ramp — get a working dev environment on the very first computer this AIOS runs on: verify the essentials are in place, optionally bridge Claude's memory into the repo, and register the machine in devices.md. The first-machine counterpart to /setup-new-computer (which matches every machine after to the first). Run it once, before /onboarding."
---

# First-time setup — get your dev environment running

This is the **on-ramp**: the very first time this AIOS runs on a
computer, this skill gets the dev environment working and registers the
machine. It's deliberately small — most of the heavy lifting (your
context, your connections) comes later, through `/onboarding` and
`/get-connected`. This is just "make the repo a comfortable place to
work, then point you at what's next."

## Where this sits

This is the **first machine**, so there's no parity target yet — you're
*creating* the baseline that future machines will match, not matching an
existing one. That's the clean split:

- **`/first-time-setup`** *(this skill)* — the **first** machine. Births
  `devices.md` and `local-setup.md`; hands off to `/onboarding`.
- **[`/setup-new-computer`](../setup-new-computer/SKILL.md)** — **every
  machine after**. Reads `devices.md` for the parity target and restores
  each connection from the password manager.
- **[`/setup-environment`](../setup-environment/SKILL.md)** — tune the
  editor look, agents, and OS bridges to taste. Optional, run anytime.

Keep this light and conversational. A one-machine user should breeze
through it; don't push tooling on someone who just wants the Markdown.

## Read this first

- **The agent is already running, so most of the bootstrap is "verify."**
  This skill lives *in* the repo, so git, a runtime, the agent CLI, and a
  clone all already exist — otherwise you couldn't be reading it. Phase 1
  is a quick checklist, not an install marathon.
- **Secrets stay out of git.** Create the gitignored `.env` if it's
  missing; never paste secrets into chat. See
  [`AGENTS.md` → Secrets](../../../AGENTS.md).
- **Platform differences.** The one OS-dependent piece here is the memory
  bridge — a **junction** on Windows (`mklink /J`), a **symlink** on
  macOS/Linux (`ln -s`). Note the host OS and adapt.

---

## 1. Verify the essentials  *(agent reads, fills gaps)*

A quick pass — confirm each, and only act where something's missing:

1. **git** — installed, and the repo is cloned to a sensible location.
2. **The agent's runtime** — e.g. Node.js LTS for Claude Code / Codex.
3. **The agent CLI** — installed and logged in (you're proof it is).
4. **`.env`** — create it at the repo root if absent (it's already
   gitignored). Leave it empty for now; connections fill it later.

If all four are present, say so and move on. This is the verify-don't-
reinstall phase.

---

## 2. The one OS-dependent decision: memory bridge  *(offer; don't impose)*

By default Claude keeps its memory in its own local store, outside the
repo — everything works with zero plumbing. The **optional** upgrade is
to bridge that memory into a tracked `memory/` folder so it travels via
git like the rest of the repo. Offer it, and let the answer decide:

> "Will you run this AIOS on more than one machine, or do you want
> Claude's memory tracked inside the repo? If yes, I'll bridge it now. If
> you're not sure, we can skip it — it's easy to add later."

- **Yes** → set up the **memory junction/symlink** now, following the
  cross-OS mechanics, the `<slug>` rule, and the gotchas in
  [`guidance/memory-junctions.md`](../../../guidance/memory-junctions.md)
  (link, don't duplicate). One ordering note: the link points at
  `~/.claude/projects/<slug>/memory`, and Claude Code only creates that
  per-project directory **after its first run** on the machine — so if
  it's not there yet, run a session first, then make the link.
- **Not sure / one machine** → skip it cleanly. Mention that
  [`/setup-environment`](../setup-environment/SKILL.md) or
  [`/setup-new-computer`](../setup-new-computer/SKILL.md) can add it
  whenever a second machine shows up. (Minimalism: don't wire it in
  before the need is real.)

The **skills** junction is *not* part of this path — the pack reads
skills as plain files in `.claude/skills/` already. Only reach for it if
the user runs **Codex** too, or wants the neutral top-level `skills/`
layout; that's covered by
[`guidance/setup-codex.md`](../../../guidance/setup-codex.md) and
[`/setup-environment`](../setup-environment/SKILL.md), not here.

---

## 3. Register this machine — birth the records

These two files are born here, on the first machine:

1. **`local-setup.md`** (gitignored, repo root) — this machine's detail:
   OS and specs, installed runtimes/CLIs, the clone location, local auth
   state. It never travels (gitignored), so it's purely local notes.
2. **`devices.md`** (tracked, repo root) — the **roster**: name, OS,
   specs, role, what's set up so far. Overview only — **no secrets or
   credential paths.** This is the **parity spec** that
   [`/setup-new-computer`](../setup-new-computer/SKILL.md) will read when
   bringing up the next machine, which is exactly why it's tracked and
   why it's created *now*, from machine #1.

Commit and push `devices.md` (per
[`guidance/git-practices.md`](../../../guidance/git-practices.md)); leave
`local-setup.md` uncommitted — it's gitignored. Commit message:
`Set up AIOS on <machine name>`.

---

## 4. Hand off

Recap what's now in place, with clickable paths, and note that the memory
bridge (if set up) is reversible. Then point forward — this skill only
gets the environment ready; the AIOS's actual content comes next:

1. **[`/onboarding`](../onboarding/SKILL.md)** — Layer 1, your context:
   who you are, what you do, your tone of voice.
2. **[`/get-connected`](../get-connected/SKILL.md)** — Layer 2, your
   connections: Gmail, Slack, and the rest.
3. *(Optional)* **[`/setup-environment`](../setup-environment/SKILL.md)**
   — editor polish, like picking a Markdown-preview palette for VS Code.

## Notes

- This skill **orchestrates**; the `guidance/*.md` docs are the source of
  truth for their own steps. Link, don't duplicate.
- The memory bridge is **opt-in by design** — set it up only when the
  user will benefit (a second machine, or wanting memory in git). The
  pack runs fine with zero plumbing.
- Commit what you create as one coherent unit, scoped by explicit
  pathspec, per
  [`guidance/git-practices.md`](../../../guidance/git-practices.md).
