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

## Sharing the skills folder with Codex

Claude Code reads skills from `.claude/skills/` (where this pack keeps
them); Codex looks in `.agents/skills/`, scanning from the working dir up
to the repo root. So out of the box Codex picks up `AGENTS.md` but **not**
the skills. To share them, point `.agents/skills` at the skills folder with
a directory junction (Windows) or symlink (macOS/Linux):

```
# Windows (junction, no admin needed)
cmd /c mklink /J .agents\skills .claude\skills
# macOS / Linux
mkdir -p .agents && ln -s ../.claude/skills .agents/skills
```

Then add `.agents/skills` to `.gitignore` so git doesn't double-track the
skills through the link. The SKILL.md `name`/`description` frontmatter is
identical for both tools, so each skill works unmodified. Full cross-OS
mechanics and the gotchas (plus the memory bridge and the `<slug>` rule)
live in [`memory-junctions.md`](memory-junctions.md). Optional — do it when
you actually run Codex on this repo, not before.

## Verify the handover

Open the same AIOS repo in both agents in turn and ask each a small
question that only makes sense if they read the project instructions
("What kind of repo is this?" / "What's the first layer of an AIOS?").
If both answer consistently, the shared `AGENTS.md` is doing its job.
