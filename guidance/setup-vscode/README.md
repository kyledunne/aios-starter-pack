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

Build a `.vscode/` folder at the repo root from the ready-made files that
ship beside this README: [`extensions.json`](extensions.json),
[`settings.json`](settings.json), [`markdown-preview.css`](markdown-preview.css),
and a [`markdown-themes/`](markdown-themes/) folder of color themes. The
sections below explain what each one does.

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

## `.vscode/markdown-preview.css` + `markdown-themes/` — the skinned preview

The look is two layers, listed in order in `settings.json`'s
`markdown.styles`:

1. **`markdown-preview.css`** — the structural base (typography, spacing,
   tables, code blocks) plus a neutral graphite fallback palette. Copy it
   to `.vscode/markdown-preview.css`.
2. **A color theme** from [`markdown-themes/`](markdown-themes/) — copy
   that folder (or just the theme you want) to `.vscode/markdown-themes/`.
   This is the **band-style** layer: tinted heading bands with a left
   accent bar and a divider that fades out at both ends, in your chosen
   palette.

### Picking a palette

The themes come in four palettes — **ocean, slate, forest, plum** — each
in a **light** and a **dark** variant (`ocean-bands.css`,
`ocean-bands-dark.css`, …). The shipped default is `ocean-bands-dark`.
Three ways to brand it:

- **Pick a shipped theme** — point the second `markdown.styles` entry at
  any file in `markdown-themes/`. Dark variants keep fenced-code colors
  legible on a dark editor theme; light variants suit a light editor.
- **Your own brand colors** — copy a theme, rename it, and change only the
  ten `--brand-*` values in its `:root` (your hex codes, or the dominant
  colors pulled from your site/logo). The band rules derive their tints
  from the heading colors, so leave them alone.
- **Plain, no bands** — remove the second entry; the base's own graphite
  palette (edit its ACTIVE PALETTE block to rebrand) shows with plain
  underlined headings.

Swappable anytime. If a Markdown preview is open, reopen a `.md` file to
see the change. See [`markdown-themes/README.md`](markdown-themes/README.md).

## Should I commit `.vscode/`?

Yes. Once you've built it, it's part of *your* AIOS and worth syncing
across your machines — commit it like anything else. (It's absent from
the *starter pack* only because the pack stays tool-agnostic; your own
copy has no reason to.)
