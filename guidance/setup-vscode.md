# VS Code setup — the `.vscode/` folder

VS Code is one nice way to read and work in an AIOS, and the pack **ships a
[`.vscode/`](../.vscode/) folder by default** so it feels native the moment you
open it: Markdown renders as a brand-skinned preview instead of raw source, HTML
previews in an integrated browser, and the agent/preview extensions are
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
  extensions the repo expects (Claude Code, Codex, and Live Preview), so anyone
  who opens it gets prompted to install them.
- **[`.vscode/settings.json`](../.vscode/settings.json)** — opens Markdown in a
  rendered preview, points HTML at the integrated browser (Live Preview), and
  applies the stylesheet below. It does **not** set an editor color theme — your
  own theme is left untouched.
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
