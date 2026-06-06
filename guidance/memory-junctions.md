# Memory & skills junctions (optional): sync memory, share skills

This is an **optional** setup, not something the pack does out of the box. By
default, skills are plain files in `.claude/skills/` (Claude Code reads them
directly) and Claude keeps its memory in its own local store — everything works
with zero plumbing. Reach for this guide when you want one of two upgrades:

- **Sync Claude's memory across machines** — bridge Claude Code's per-project
  memory directory into a tracked `memory/` folder, so memories travel via git
  like the rest of the repo.
- **Share one skills folder across tools** — surface a single skills folder to
  *both* Claude Code and Codex (and keep it at a neutral top-level `skills/` if
  you prefer that to `.claude/skills/`).

Neither is needed to start. They're a natural thing to set up once you have a
**second machine** (memory sync starts to matter) or you **add Codex** (skills
sharing starts to matter) — exactly the kind of upgrade
[`/whats-next`](../.claude/skills/whats-next/SKILL.md) can surface when the need
shows up. Minimalism: don't wire this in before then.

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

**Skills** — the default pack keeps skills as real files in `.claude/skills/`. The
two skills rows above are for the heavier layout where you want one neutral,
top-level `skills/` folder shared by both tools: move the skill folders to
`skills/`, then point **both** `.claude/skills` and `.agents/skills` at it. If all
you actually want is for Codex to see the skills where they already live, the
lighter move is a single link `.agents/skills` → `.claude/skills` — see
[`set-up-codex.md`](set-up-codex.md).

## Cross-OS: how to make a link

**Windows** — a junction, no admin required (unlike symlinks):

```
cmd /c mklink /J "<link path>" "<absolute target path>"
```

**macOS / Linux** — a symlink:

```
ln -s "<target path>" "<link path>"
```

For example, a `.agents/skills` → `.claude/skills` link from the repo root:

```
# Windows
cmd /c mklink /J .agents\skills .claude\skills
# macOS / Linux
mkdir -p .agents && ln -s ../.claude/skills .agents/skills
```

## Gotchas (learned the hard way)

- **Gitignore any in-repo link you create.** If you route `.claude/skills` or
  `.agents/skills` as links into a top-level `skills/`, add them to `.gitignore`
  — otherwise Windows git treats the junction as a real directory and **recurses
  it**, double-tracking every skill. (The default pack doesn't need this: its
  `.claude/skills/` is a *real* committed folder, not a link.) The memory link
  lives outside the repo, so it never needs a gitignore entry.
- **Skill relative links assume depth 3.** A skill at `<skills>/X/SKILL.md` links
  to the repo root as `../../../` — correct whether it's read from
  `.claude/skills/X/` or `.agents/skills/X/` (both three deep). Don't "fix" them
  to `../../`.
- **Codex prompts to trust project hooks.** If you automate link creation with a
  Codex `SessionStart` hook (below), Codex won't run it until you trust the
  project — run `/hooks` in Codex once to approve.
- **The memory link needs Claude's project dir first** (above) — on a brand-new
  machine, create the memory link after Claude Code's first run.

## Optional: keep the links healed automatically

The links are per-machine and can break (a wiped `~/.claude`, a fresh clone). If
you'd rather not recreate them by hand, wire a small idempotent script to a
**`SessionStart` hook** so it re-checks them whenever an agent starts — Claude
Code via `.claude/settings.json` (`hooks.SessionStart`), Codex via
`.codex/hooks.json` (`SessionStart`, matcher `startup|resume`). Keep the script
**native per platform** (a `.ps1` using `mklink /J` on Windows, a `.sh` using
`ln -s` on Unix) and select the right one per machine — the hook command itself
is OS-specific, so it belongs in per-machine config rather than anything you
commit.

Put such a script in a **`scripts/` folder at the repo root** — the conventional
home for AIOS scripts. (The starter pack ships none, to stay lean and
transparent; this is where the first one would go.)
