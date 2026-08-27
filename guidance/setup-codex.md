# Set up Codex CLI alongside Claude Code

An AIOS shouldn't be locked to one AI agent. If the user is already
running Claude Code on this repo, adding the **OpenAI Codex CLI** as a
second agent costs almost nothing and is worth doing — the two have
different strengths and the AIOS reads the same regardless of which
one is driving.

## Why run both

- **Claude Code** is stronger for open-ended creative work,
  brainstorming, and conversational sessions where the path isn't
  defined up front.
- **Codex** is stronger at executing tight, well-specified prompts
  exactly — useful for repetitive structured tasks.

The lineup will keep shifting as the field moves; the point is that
the AIOS itself doesn't depend on the choice.

## The one piece of glue: `AGENTS.md`

Codex reads project instructions from `AGENTS.md`. Claude Code reads
them from `CLAUDE.md`. To keep one source of truth, put the real
instructions in `AGENTS.md` and reduce `CLAUDE.md` to a single line
importing it:

```
@AGENTS.md
```

That preserves Claude's auto-load behaviour while letting Codex (and
any other tool that has converged on `AGENTS.md` — Cursor, Aider, and
others) read the same file. Editing one place updates both.

## Install Codex

The Codex CLI install + auth instructions live with OpenAI and change
over time, so don't restate them here. Follow the upstream docs:

- <https://github.com/openai/codex>

Once installed, `cd` into the AIOS repo and run Codex. It'll pick up
`AGENTS.md` automatically.

## Skills: already shared, nothing to do

Codex looks for skills in `.agents/skills/`, scanning from the working dir
up to the repo root; Claude Code looks in `.claude/skills/`. The pack keeps
the real skill folders at top-level [`../skills/`](../skills/) and makes
**both** of those paths machine-local links into it, so Codex sees the same
eleven skills Claude does the first time you run it — no setup step.

The links are made by `.claude/hooks/ensure-skills-link.mjs` on a
`SessionStart` hook, wired from both `.claude/settings.json` and
`.codex/hooks.json`, so whichever agent starts first heals both. The
`SKILL.md` `name`/`description` frontmatter is identical for both tools, so
each skill works unmodified. Full mechanics and the gotchas are in
**Skills** in [`../AGENTS.md`](../AGENTS.md); the cross-OS link details (and
the memory bridge) are in [`memory-junctions.md`](memory-junctions.md).

**One thing you do have to do once:** Codex won't run a project hook until
you trust the project. Run `/hooks` in Codex once to approve it — until you
do, `.agents/skills` never gets created and Codex sees no skills.

## Verify the handover

Open the same AIOS repo in both agents in turn and ask each a small
question that only makes sense if they read the project instructions
("What kind of repo is this?" / "What's the first layer of an AIOS?").
If both answer consistently, the shared `AGENTS.md` is doing its job.
