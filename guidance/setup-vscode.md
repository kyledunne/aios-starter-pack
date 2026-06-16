# VS Code setup — the `.vscode/` folder

VS Code is one nice way to read and work in an AIOS, and the pack **ships a
[`.vscode/`](../.vscode/) folder by default** so it feels native the moment you
open it: Markdown renders as a brand-skinned preview instead of raw source, HTML
opens as a one-click interactive preview, and the agent/preview extensions are
recommended on every machine you sync to.

Shipping it costs non-VS-Code users nothing. A `.vscode/` folder is **inert
unless the repo is opened in VS Code** — in a terminal, another editor, or a
desktop app it's just a few unread files. (This is what makes it different from
the pack's other tooling, like Codex routing or cross-machine junctions, which
need active per-machine setup and so stay opt-in via
[`/setup-environment`](../.claude/skills/setup-environment/SKILL.md).) If you
don't use VS Code, ignore the folder or delete it — nothing else depends on it.

The folder is **yours**, like the rest of the repo: edit it, pick a palette, add
your brand colors, commit it, sync it across your machines. This doc explains
what ships and how to change it.

## What ships

- **[`.vscode/extensions.json`](../.vscode/extensions.json)** — recommends the
  Marketplace extensions the repo expects (Claude Code, Codex, and Live Preview),
  so anyone who opens it gets prompted to install them.
- **[`.vscode/settings.json`](../.vscode/settings.json)** — opens Markdown and
  HTML in a rendered preview (see [HTML preview](#html-preview) below) and
  applies the stylesheet below. It does **not** set an editor color theme — your
  own theme is left untouched.
- **[`.vscode/aios-html-preview/`](../.vscode/aios-html-preview/)** — a tiny
  bundled VS Code extension (a prebuilt `.vsix` + its source) that renders HTML
  as a one-click interactive preview. See [HTML preview](#html-preview).
- **[`.vscode/aios-markdown-auto-preview/`](../.vscode/aios-markdown-auto-preview/)**
  — a second tiny bundled extension that reopens a `.md` file as rendered preview
  when something force-opens it as source — chiefly a link clicked in the Claude
  Code chat panel, which bypasses the editor association. See
  [Markdown auto-preview](#markdown-auto-preview).
- **[`.vscode/markdown-preview.css`](../.vscode/markdown-preview.css)** — the
  structural base for the Markdown preview (typography, spacing, tables, code
  blocks) plus a neutral graphite fallback palette.
- **[`.vscode/markdown-themes/`](../.vscode/markdown-themes/)** — a folder of
  color palettes layered on top of the base. This is the **band-style** layer:
  tinted heading bands with a left accent bar and a divider that fades out at
  both ends. Pure CSS on the normal Markdown structure, so **nothing in your
  `.md` files changes**.

The look is two layers, listed in order in `settings.json`'s `markdown.styles`:
the base first, a color theme second.

## HTML preview

Markdown has a built-in VS Code preview; HTML doesn't. So the pack bundles a
deliberately tiny extension —
[`.vscode/aios-html-preview/`](../.vscode/aios-html-preview/) — that opens
`.html` files as a **one-click, interactive rendered preview** instead of source.
It's there so HTML your AIOS produces (like
[`planet-analogy.html`](../planet-analogy.html)) reads as a page, not as code.

It isn't on the VS Code Marketplace, so — unlike the extensions in
`extensions.json` — it can't be auto-recommended. It ships as a prebuilt
`.vsix` and is **inert until installed**. Until then, `.html` falls back to
opening as source.

**Install it:**

```sh
code --install-extension .vscode/aios-html-preview/aios-html-preview-0.1.0.vsix --force
```

[`/setup-environment`](../.claude/skills/setup-environment/SKILL.md) offers to do
this (run it on each machine — a `.vsix` install is per-machine, not synced by
git). The `*.html` → `aios.htmlPreview` association in `settings.json` already
ships, so once it's installed, a single click previews.

**Editing HTML source:** right-click the file → **Open With… → Text Editor**
(or remove the `*.html` line from `settings.json` to make source the default).

**What it renders:** self-contained pages — inline `<script>`/`<style>`, CDN
tags (React, Tailwind), relative resources — and it live-reloads when you edit
in a split text editor.

**What it doesn't:** pages needing a real local server (`fetch('/api/...')`,
client-side routing). Those are what the recommended **Live Preview** extension
is for — open such a page and click its globe "Show Preview" icon (or press
Alt+L Alt+O) for a server-backed integrated-browser preview. The two are
complementary; Live Preview registers no custom editor, so it can't be a
one-click default, which is why the bundled extension exists.

## Markdown auto-preview

Markdown already opens rendered, via the `*.md` → `vscode.markdown.preview.editor`
association in `settings.json` — from the Explorer, Quick Open, and everywhere
that honors editor associations. The one place that **doesn't** honor it is the
**Claude Code chat panel**: it's a closed webview that bypasses the association
and force-opens a `.md` link as raw **source**. No setting reaches it.

So the pack bundles a second tiny extension —
[`.vscode/aios-markdown-auto-preview/`](../.vscode/aios-markdown-auto-preview/) —
that watches the editor tabs and, when a `.md` lands as source unexpectedly,
closes it and reopens it as rendered preview. The payoff is reading Markdown the
agent drafts for you in one click, straight from the chat. Like the HTML
extension it isn't on the Marketplace, ships as a prebuilt `.vsix`, and is
**inert until installed**.

**Install it:**

```sh
code --install-extension .vscode/aios-markdown-auto-preview/aios-markdown-auto-preview-1.0.0.vsix --force
```

[`/setup-environment`](../.claude/skills/setup-environment/SKILL.md) offers this
alongside the HTML one (per-machine; reload the window after). Unlike the HTML
extension it registers **no custom editor** — it leans on VS Code's own Markdown
preview, so it works with or without the `*.md` association.

**Reading source when you want it:** on a preview, click **"Reopen as source
file"** (it sticks); or Command Palette → **AIOS: Open This Markdown as Source**;
or turn it off with **AIOS: Toggle Markdown Auto-Preview** (worth it if you edit
`.md` source a lot). Full notes:
[`.vscode/aios-markdown-auto-preview/README.md`](../.vscode/aios-markdown-auto-preview/README.md).

## Palettes

The themes come in four palettes — **ocean, slate, forest, plum** — each in a
**light** and a **dark** variant:

| Palette | Light              | Dark                    |
| ------- | ------------------ | ----------------------- |
| Ocean   | `ocean-bands.css`  | `ocean-bands-dark.css`  |
| Slate   | `slate-bands.css`  | `slate-bands-dark.css`  |
| Forest  | `forest-bands.css` | `forest-bands-dark.css` |
| Plum    | `plum-bands.css`   | `plum-bands-dark.css`   |

The shipped default is **`ocean-bands-dark`** (dark keeps fenced-code syntax
colors legible on VS Code's default dark editor theme). Light variants are there
for light editor themes, or just taste.

### Switching palette

Point the **second** `markdown.styles` entry in
[`.vscode/settings.json`](../.vscode/settings.json) at any file in
`markdown-themes/` (the first entry stays the base):

```jsonc
// .vscode/settings.json
"markdown.styles": [
  ".vscode/markdown-preview.css",            // structure (keep)
  ".vscode/markdown-themes/ocean-bands.css"  // <- swap this filename anytime
]
```

Save, then reopen a `.md` preview to see it. Steer dark for a dark editor theme,
light for a light one. [`/setup-environment`](../.claude/skills/setup-environment/SKILL.md)
can pick one for you.

### Plain, no bands

Remove the second entry entirely. The base's own neutral graphite palette shows
with plain underlined headings (edit its ACTIVE PALETTE block to rebrand that).

### Your own brand colors

Each theme file is self-contained: a `:root` block of ten `--brand-*` color
variables followed by the (identical) band rules. To brand it, copy any theme,
rename it, and change only the ten `:root` values — your hex codes, or the
dominant colors pulled from your site/logo. The band rules derive their tints
from the heading colors, so you never touch them.
