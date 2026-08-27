# Memory junction (optional): sync Claude's memory into the repo

The same trick the pack already uses for skills, pointed at a second target.
Out of the box Claude keeps its memory in its own local store outside the repo,
which works fine and needs no plumbing. Reach for this guide when you want the
upgrade:

- **Sync Claude's memory across machines** — bridge Claude Code's per-project
  memory directory into a tracked `memory/` folder, so memories travel via git
  like the rest of the repo.

It isn't needed to start. It's a natural thing to set up once you have a
**second machine**, where memory sync starts to matter — exactly the kind of
upgrade [`/whats-next`](../skills/whats-next/SKILL.md) can surface when the need
shows up. Minimalism: don't wire this in before then.

**The skills links are a different story: they already ship.** `.claude/skills`
and `.agents/skills` are created for you at every session start, so both Claude
Code and Codex read the one top-level `skills/` folder with nothing to set up.
That's described in **Skills** in [`../AGENTS.md`](../AGENTS.md); this doc keeps
them in its table below only because the mechanics are shared.

## What a junction / symlink is

A **junction** (Windows) or **symbolic link** (macOS/Linux) is a directory that
transparently points at another directory: open `A`, and the filesystem serves
you the contents of `B`. The trick here is that an agent CLI insists on finding
something at *its own* fixed path, but you want the real content to live in the
tracked repo. A link at the path the agent expects, pointing into the repo,
satisfies both.

The links themselves are **per-machine** — they're pointers, not content, so
they're never committed; only the real target folder is tracked. That means you
recreate them on each machine you want them on.

## The bridges

| Link (per-machine, gitignored)     | → Target (tracked) | Gives you |
|------------------------------------|--------------------|-----------|
| `~/.claude/projects/<slug>/memory` | repo `memory/`     | Claude memory synced via git |
| `.claude/skills`                   | repo `skills/`     | Claude reads the shared folder |
| `.agents/skills`                   | repo `skills/`     | Codex reads the same folder |

`<slug>` is the repo path with `:` `\` `/` replaced by `-`, drive letter
lowercased — `c:\Users\sam\AIOS` → `c--Users-sam-AIOS`. (That's how Claude Code
names its per-project directory under `~/.claude/projects/`.)

**Memory** lives *outside* the repo (`~/.claude/...`), so its link is what brings
memory *into* `memory/`. Claude Code only creates the
`~/.claude/projects/<slug>/` directory after it has run once in the repo, so make
the memory link *after* Claude Code's first session on the machine.

**Skills** — the two skills rows are the layout the pack **already ships**: the
real skill folders live at top-level `skills/`, and both links point at it, so
Claude Code and Codex read one source of truth. You don't create these by hand —
[`../.claude/hooks/ensure-skills-link.mjs`](../.claude/hooks/ensure-skills-link.mjs)
does it at every session start, from both agents' `SessionStart` hooks. They're
in the table because they're the clearest example of the mechanic.

## Cross-OS: how to make a link

**Windows** — a junction, no admin required (unlike symlinks):

```
cmd /c mklink /J "<link path>" "<absolute target path>"
```

**macOS / Linux** — a symlink:

```
ln -s "<target path>" "<link path>"
```

For example, an `.agents/skills` → `skills/` link from the repo root (which
the session hook already makes for you — shown here as the shape of the
command):

```
# Windows
cmd /c mklink /J .agents\skills skills
# macOS / Linux
mkdir -p .agents && ln -s ../skills .agents/skills
```

## Gotchas (learned the hard way)

- **Gitignore any in-repo link you create**, or Windows git treats the junction
  as a real directory and **recurses it**, double-tracking every file behind it.
  The pack already carries `.claude/skills` and `.agents/skills` in
  `.gitignore` for exactly this reason — note the **missing trailing slash**: a
  Linux symlink is not a directory, so a `skills/` pattern would miss it and the
  link would get committed. The memory link lives outside the repo, so it never
  needs a gitignore entry.
- **Skill relative links assume depth 3.** A skill at `<skills>/X/SKILL.md` links
  to the repo root as `../../../` — correct whether it's read from
  `.claude/skills/X/` or `.agents/skills/X/` (both three deep). Don't "fix" them
  to `../../`.
- **Codex prompts to trust project hooks.** If you automate link creation with a
  Codex `SessionStart` hook (below), Codex won't run it until you trust the
  project — run `/hooks` in Codex once to approve.
- **The memory link needs Claude's project dir first** (above) — on a brand-new
  machine, create the memory link after Claude Code's first run.

## Keeping the links healed automatically

The links are per-machine and can break (a wiped `~/.claude`, a fresh clone), so
recreating them by hand gets old fast. The fix is a small idempotent script on a
**`SessionStart` hook**, so it re-checks them whenever an agent starts — Claude
Code via `.claude/settings.json` (`hooks.SessionStart`), Codex via
`.codex/hooks.json` (`SessionStart`, matcher `startup|resume`).

The pack ships exactly that for the skills links:
[`../.claude/hooks/ensure-skills-link.mjs`](../.claude/hooks/ensure-skills-link.mjs),
wired from both agents. Write it in **Node rather than per-OS shell** —
`fs.symlinkSync(target, path, 'junction')` makes a junction on Windows and a
plain symlink everywhere else, so one committed script covers every machine and
nothing has to be selected per platform. Copy its shape if you want the same
treatment for the memory link.
