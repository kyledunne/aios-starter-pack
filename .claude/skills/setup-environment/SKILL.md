---
name: setup-environment
description: "Optional, run-anytime setup that adapts the AIOS repo to how you actually work with it — across three layers: the UI you read and edit it in (VS Code, a desktop app, a terminal), the AI agent(s) that drive it (Claude Code, Codex), and the operating system(s) of your machine(s). A default .vscode/ folder ships (inert unless opened in VS Code); nothing else tool-specific does. Run this to tune the editor look, route skills to multiple agents, or set up cross-machine sync. Entirely optional and skippable — separate from onboarding and get-connected."
---

# Set up your environment — fit the AIOS to your tools

The AIOS is just a git repo of Markdown, so it runs anywhere with zero
setup. Apart from a default `.vscode/` folder (inert unless you open the
repo in VS Code), the pack ships **bare** — assuming only Claude Code
reading plain files. This skill is the optional layer on top: it tunes the
repo to *how you actually work with it*.

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

- **VS Code** → the [`.vscode/`](../../../.vscode/) folder already ships
  (recommended extensions, Markdown-as-preview, HTML-as-preview, the brand
  `markdown-preview.css`), so there's little to build — they'll be prompted to
  install the Marketplace extensions on first open. Two quick things to offer:
  **(a)** install the bundled **HTML preview** extension so `.html` files open
  as a one-click interactive preview (it's a bundled `.vsix`, not on the
  Marketplace, so it doesn't come from the install prompt) —
  `code --install-extension .vscode/aios-html-preview/aios-html-preview-0.1.0.vsix --force`;
  and **(b)** the fun part: **pick a palette** (below). Reference:
  [`guidance/setup-vscode.md`](../../../guidance/setup-vscode.md).
- **A desktop app (Claude / Codex)** → it brings its own UI; there's
  little to configure. Markdown renders in-app; the shipped `.vscode/`
  folder just sits there unused (delete it if they like).
- **Terminal + browser / another editor** → nothing to install, it's
  plain Markdown and the `.vscode/` folder is inert. Point out that
  `planet-analogy.html` opens in any browser.

#### Pick a palette  *(VS Code only — the fun one)*

If they use VS Code, offer to brand the Markdown preview — a quick,
reversible delight (the `.vscode/` folder already ships):

> "Want to pick a color scheme for how your AIOS looks? There are four
> palettes — ocean, slate, forest, plum — each in light and dark. Or I
> can match your own brand colors."

The themes live in `.vscode/markdown-themes/` (band-style: tinted heading
bands with an accent bar + a fading divider). To apply one, set the
**second** `markdown.styles` entry in `.vscode/settings.json` to its path:

- **A shipped theme** — `ocean`, `slate`, `forest`, or `plum`, light or
  dark (e.g. `.vscode/markdown-themes/forest-bands.css`). The default is
  `ocean-bands-dark`. Steer dark for a dark editor theme, light for a
  light one — it keeps fenced-code colors legible.
- **Their own brand colors** — ask for hex codes, or a link to their
  site/logo to pull dominant colors from; copy a theme, rename it, and
  change only the ten `--brand-*` values in its `:root` (the band rules
  derive from those).
- **Plain / no bands** — remove the second entry for plain headings on
  the base's neutral palette.

Swappable anytime. If a preview is open, mention they can reopen a `.md`
file to see it. A 60-second delight, not a design review. Details:
[`guidance/setup-vscode.md`](../../../guidance/setup-vscode.md#palettes).

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
  The memory bridge can also be set up at the very start via
  [`/first-time-setup`](../first-time-setup/SKILL.md); bringing a *new*
  machine up to parity with an existing one is its own flow:
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
- Tool-specific config is **opt-in by design**, with one exception: the
  `.vscode/` folder ships by default, because it's inert unless the repo is
  opened in VS Code. Everything else (Codex routing, junctions) the pack
  ships bare — set up only what they'll use, skip the rest.
- Commit what you create as one coherent unit (a palette tweak, a Codex
  routing setup), per
  [`guidance/git-practices.md`](../../../guidance/git-practices.md).
  Machine-local junctions are gitignored, not committed.
