# Set up VS Code for the AIOS

VS Code is one nice way to read and work in an AIOS — but only one. The
pack ships **no** `.vscode/` folder on purpose: the AIOS is a plain
Markdown repo that works just as well in another editor, a terminal, or
a desktop app, and baking in editor-specific config would make it
opinionated about a tool you might not use. Claude Code is the only thing
assumed by default, and it needs nothing here.

If you *do* use VS Code, this builds out a `.vscode/` folder that makes
the repo feel native: Markdown opens as a rendered, brand-skinned preview
instead of raw source, HTML previews in an integrated browser, and the
agent/preview extensions are recommended on every machine you sync to.

The [`/setup-environment`](../../.claude/skills/setup-environment/SKILL.md)
skill does all of this for you (and offers to pick a color palette). This
is the underlying reference — read it to set things up by hand, or to
understand what the skill writes.

Create three files under a `.vscode/` folder at the repo root. All three
ship beside this README as ready-made files to copy —
[`extensions.json`](extensions.json), [`settings.json`](settings.json),
and [`markdown-preview.css`](markdown-preview.css); the sections below
explain what each one does.

## `.vscode/extensions.json` — recommended extensions

Prompts anyone who opens the repo to install the extensions it expects
(Claude Code, Codex, and Live Preview). Copy
[`extensions.json`](extensions.json) from this folder to
`.vscode/extensions.json`.

## `.vscode/settings.json` — editor defaults

Opens Markdown in a rendered preview, points HTML at the integrated
browser, and applies the brand stylesheet below. Copy
[`settings.json`](settings.json) from this folder to
`.vscode/settings.json`.

## `.vscode/markdown-preview.css` — brand-skinned Markdown preview

Copy the [`markdown-preview.css`](markdown-preview.css) file from this
folder to `.vscode/markdown-preview.css`. The whole look is driven by the
ten `--brand-*` variables in the **ACTIVE PALETTE** block at the top — to
rebrand, change only those.

### Picking a palette

Three ways to brand it:

- **A named preset** — `slate`, `forest`, `plum`, or `ocean` (listed in
  the file's comments). Copy the chosen preset's ten values over the
  ACTIVE PALETTE block.
- **Your own brand colors** — drop in your hex codes, or pull the
  dominant colors from your website/logo and map them onto the
  `--brand-*` roles (background, text, headings, links, accents).
- **Keep the default** — neutral graphite; change nothing.

It's just ten CSS variables, swappable anytime. If a Markdown preview is
open, reopen a `.md` file to see the new colors.

## Should I commit `.vscode/`?

Yes. Once you've built it, it's part of *your* AIOS and worth syncing
across your machines — commit it like anything else. (It's absent from
the *starter pack* only because the pack stays tool-agnostic; your own
copy has no reason to.)
