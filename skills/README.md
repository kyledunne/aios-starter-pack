# Skills

Re-runnable procedures an agent invokes as a slash command. One folder per
skill, holding a `SKILL.md` — its frontmatter carries the name and the
description the agent sees in its skills list; the body is the procedure.

**This folder is the single source of truth.** Claude Code discovers skills at
`.claude/skills/` and the OpenAI Codex CLI at `.agents/skills/`; both are
**machine-local links** into here (a directory junction on Windows, a symlink on
macOS/Linux), recreated at the start of every session by
[`.claude/hooks/ensure-skills-link.mjs`](../.claude/hooks/ensure-skills-link.mjs).
Add a skill here and both agents see it. See **Skills** in
[`AGENTS.md`](../AGENTS.md) for the full picture.

## Index

### Getting set up

- [first-time-setup](first-time-setup/SKILL.md) — the on-ramp for the very
  first machine this AIOS runs on: verify the essentials, optionally bridge
  Claude's memory into the repo, register the machine.
- [onboarding](onboarding/SKILL.md) — the Layer-1 interview: who the user is,
  what they do, who they work with, tone of voice. A thin front door onto
  [`advisors/onboarding-advisor.md`](../advisors/onboarding-advisor.md).
- [get-connected](get-connected/SKILL.md) — the first two Layer-2 connections,
  Google Workspace and Slack.
- [setup-environment](setup-environment/SKILL.md) — optional, run-anytime
  tuning of the repo to the editor, agent(s), and OS actually in use.
- [setup-new-computer](setup-new-computer/SKILL.md) — bring the AIOS up on a
  second (or fifth) machine, to parity with the first.

### Everyday work

- [sync](sync/SKILL.md) — pull and push, handling merge conflicts so nothing
  is lost.
- [whats-next](whats-next/SKILL.md) — sync guidance from upstream, compare it
  against what's set up here, and propose the high-leverage next steps.
- [grill-me](grill-me/SKILL.md) — interview the user one question at a time to
  get a plan out of their head and into a capture file.
- [dream](dream/SKILL.md) — sweep the `memory/` store, repair what's broken,
  and resync the index.

### The `working/` task lifecycle

See [`guidance/working-directory.md`](../guidance/working-directory.md) for the
pattern these two serve.

- [checkpoint-working-task](checkpoint-working-task/SKILL.md) — an explicit
  save-point: commit and push a task folder mid-flight, without wrapping it up.
- [complete-working-task](complete-working-task/SKILL.md) — write the wrap-up
  README, capture the lessons, archive the folder by date, commit and push.

## A note on relative links

Inside a `SKILL.md`, links to the repo root are written `../../../` — three
levels, not the two you'd count from `skills/X/SKILL.md`. That's deliberate:
agents read skills through the links, at `.claude/skills/X/SKILL.md` or
`.agents/skills/X/SKILL.md`, both of which are three deep. Don't "fix" them to
`../../`. (This README is not loaded as a skill, so it uses the real depth.)

## Adding one

Same rule as everything else here (**Minimalism**): add a skill when a real
procedure has been done twice by hand, not in anticipation. Create
`skills/<name>/SKILL.md` with `name` and `description` frontmatter, add a line
to the index above, and both agents pick it up on their next session.
