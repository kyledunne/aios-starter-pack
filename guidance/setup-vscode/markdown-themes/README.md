# Markdown-preview color themes

Band-style color themes for the VS Code Markdown preview. Each one layers
on top of [`../markdown-preview.css`](../markdown-preview.css) (the
structural base) and gives headings a **tinted band with a left accent
bar** and turns the divider into a **gradient rule that fades out at both
ends** — a richer look than the base's plain underlined headings. It's
all pure CSS on the normal Markdown structure, so **nothing in your `.md`
files changes**.

## The themes

The same band formatting in four palettes, each in a **light** and a
**dark** variant:

| Palette  | Light                | Dark                      |
| -------- | -------------------- | ------------------------- |
| Ocean    | `ocean-bands.css`    | `ocean-bands-dark.css`    |
| Slate    | `slate-bands.css`    | `slate-bands-dark.css`    |
| Forest   | `forest-bands.css`   | `forest-bands-dark.css`   |
| Plum     | `plum-bands.css`     | `plum-bands-dark.css`     |

The pack ships **`ocean-bands-dark`** as the default (dark keeps
fenced-code syntax colors legible on VS Code's default dark editor
theme). Light variants are there for light editor themes or just taste.

## Using one

Copy the base CSS and the theme(s) you want into your repo's `.vscode/`,
then point the **second** `markdown.styles` entry at your chosen theme
(the first stays the base):

```jsonc
// .vscode/settings.json
"markdown.styles": [
  ".vscode/markdown-preview.css",          // structure (keep)
  ".vscode/markdown-themes/ocean-bands.css" // <- swap this filename anytime
]
```

Save, then reopen a `.md` preview to see it. To go back to **plain**
headings with the base's own palette, just remove the second entry.
[`/setup-environment`](../../../.claude/skills/setup-environment/SKILL.md)
can pick one for you.

## Making your own

Each file is self-contained: a `:root` block of ten `--brand-*` color
variables followed by the (identical) band rules. To brand it, copy any
theme, rename it, and change only the ten `:root` values — your hex
codes, or the dominant colors pulled from your site/logo. The band rules
derive their tints from the heading colors, so you never touch them.
