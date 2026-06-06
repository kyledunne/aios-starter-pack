---
name: setup-environment
description: Optional, run-anytime setup that adapts the AIOS repo to how you actually work with it — across three layers: the UI you read and edit it in (VS Code, a desktop app, a terminal), the AI agent(s) that drive it (Claude Code, Codex), and the operating system(s) of your machine(s). The pack ships nothing tool-specific by default; run this if you want editor polish, multi-agent skills routing, or cross-machine sync. Entirely optional and skippable — separate from onboarding and get-connected.
---

# Set up your environment — fit the AIOS to your tools

The AIOS is just a git repo of Markdown, so it runs anywhere with zero
setup — the pack ships **bare**, assuming only Claude Code reading plain
files. This skill is the optional layer on top: it tunes the repo to
*how you actually work with it*.

Run it whenever — now, later, or never. It's **separate from
`/onboarding`** (which builds Layer 1, your context) and
**`/get-connected`** (Layer 2, your connections); this is purely your dev
environment, not the AIOS's content. Some people love tuning their
editor and agents; some never touch it. Both are completely fine — keep
this light and skippable, and never push tooling on someone who just
wants the Markdown.

## The three layers of "your environment"

1. **UI layer** — how you *read and edit* the repo. VS Code (with a
   brand-skinned Markdown preview), the Claude or Codex desktop app, a
   terminal + browser, or another editor. You can use more than one.
2. **Agentic layer** — which AI agent(s) *drive* the repo: Claude Code,
   Codex, or both. (The Claude and Codex desktop apps bundle the UI and
   the agent together.)
3. **OS layer** — the operating system on this machine, plus any other
   computers you run this AIOS on. This decides junctions (Windows) vs
   symlinks (macOS/Linux) and a few path/shell conventions.

## How to run it

One thing at a time, conversational. Figure out where the user sits on
each layer, then set up only what they'll actually use. Offer, don't
impose.

### 1. Figure out their setup

Ask lightly — and infer what you can rather than re-asking what you can
already see (you likely know the OS, and that Claude Code is running):

> "Quick picture of how you work with this repo: what do you open it in
> — VS Code, a desktop app, a terminal? What AI agent drives it — Claude
> Code, Codex, or both? And what computer(s) will you run it on — just
> this one, or others too (and which OS each)?"

### 2. UI layer

- **VS Code** → build the `.vscode/` folder from
  [`guidance/setup-vscode/`](../../../guidance/setup-vscode/README.md): the
  recommended extensions (Claude Code, Codex, Live Preview), the settings
  that open Markdown as a rendered preview and HTML in an integrated
  browser, and the brand `markdown-preview.css`. Then do the fun part —
  **pick a palette** (below).
- **A desktop app (Claude / Codex)** → it brings its own UI; there's
  little to configure. Markdown renders in-app; skip the VS Code folder.
- **Terminal + browser / another editor** → nothing to install, it's
  plain Markdown. Point out that `planet-analogy.html` opens in any
  browser.

#### Pick a palette  *(VS Code only — the fun one)*

If they set up the VS Code folder, offer to brand the Markdown preview —
a quick, reversible delight:

> "Want to pick a color scheme for how your AIOS looks? I can use a
> ready-made palette, match your brand, or leave the neutral default."

Write the chosen values into the **ACTIVE PALETTE** block at the top of
`.vscode/markdown-preview.css`:

- **A named preset** — `slate`, `forest`, `plum`, or `ocean` (listed in
  the file's comments). Copy its ten values over the ACTIVE block.
- **Their own brand colors** — ask for hex codes, or for a link to their
  site/logo and pull the dominant colors from it; map them onto the
  `--brand-*` roles.
- **Keep the default** — neutral graphite; nothing to change.

Ten CSS variables, swappable anytime. If a preview is open, mention they
can reopen a `.md` file to see the new colors. A 60-second delight, not a
design review.

### 3. Agentic layer

- **Claude Code** → the default. `.claude/skills/` ships in the box and
  is read automatically — nothing to do.
- **Codex (as well as, or instead of, Claude Code)** → follow
  [`guidance/setup-codex.md`](../../../guidance/setup-codex.md). The
  shared `AGENTS.md` glue already ships, so the main step is routing the
  skills folder to `.agents/skills/` (junction on Windows, symlink on
  macOS/Linux). Only if they actually run Codex on this repo.

### 4. OS layer / multiple machines

- Note the host OS — junctions (Windows) vs symlinks (macOS/Linux) differ;
  the guidance docs give both.
- If they'll run the AIOS on **more than one machine**, that's where the
  optional **memory + skills junctions** earn their keep — syncing
  Claude's memory into a tracked `memory/` folder, and sharing one skills
  folder across tools. See
  [`guidance/memory-junctions.md`](../../../guidance/memory-junctions.md).
  Bringing a brand-new machine up to parity is its own flow:
  [`/setup-new-computer`](../setup-new-computer/SKILL.md).
- Make sure each machine they use is recorded in `devices.md` (born the
  first time the AIOS runs on a machine).

### 5. Wrap up

Recap what you set up, with clickable paths. Note that all of it is
reversible and re-runnable — they can run `/setup-environment` again
anytime their tools change.

## Notes

- This skill **orchestrates**; the `guidance/setup-*.md` docs are the
  source of truth for their own steps. Link, don't duplicate.
- Tool-specific config is **opt-in by design** — the pack ships bare so
  it isn't opinionated about anyone's setup. Set up what they'll use,
  skip the rest.
- Commit what you create as one coherent unit (e.g. a new `.vscode/`),
  per [`guidance/git-practices.md`](../../../guidance/git-practices.md).
  Machine-local junctions are gitignored, not committed.
