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

Create three files under a `.vscode/` folder at the repo root. The first
two are short, so they're inline below; the third — the Markdown
stylesheet — is long, so it ships beside this README as a ready-made file
to copy: [`markdown-preview.css`](markdown-preview.css).

## `.vscode/extensions.json` — recommended extensions

Prompts anyone who opens the repo to install the extensions it expects.

```jsonc
{
  // Recommended on every machine this AIOS syncs to.
  "recommendations": [
    // Claude Code and Codex — the AI coding agents that drive this AIOS from inside
    // the editor. Both read the same repo (AGENTS.md / CLAUDE.md, .claude/skills/),
    // so either can pick up the work. Install whichever you use; having both lets you
    // switch between them without leaving VS Code.
    "anthropic.claude-code",
    "openai.chatgpt",

    // Live Preview gives a one-click integrated-browser preview of HTML files
    // (globe "Show Preview" icon, or Alt+L Alt+O) — used for planet-analogy.html
    // and any other HTML the AIOS produces. Matching settings live in
    // .vscode/settings.json (livePreview.*).
    "ms-vscode.live-server"
  ]
}
```

## `.vscode/settings.json` — editor defaults

Opens Markdown in a rendered preview, points HTML at the integrated
browser, and applies the brand stylesheet below.

```jsonc
{
  // Open Markdown files in rendered preview by default instead of the raw source.
  // To edit a file's source, use the "Open Source" action (the {} icon top-right)
  // or right-click the file > Open With… > Text Editor.
  "workbench.editorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  },
  // HTML has no built-in "open in browser" editor, and the Live Preview extension
  // registers commands only (no custom editor), so it can't be set as a default
  // editorAssociation the way Markdown can. Instead: open an .html file and click the
  // globe "Show Preview" icon (top-right) or press Alt+L Alt+O to view it in the
  // integrated browser. These keys make that preview use the embedded browser pane.
  // The extension itself is recommended in .vscode/extensions.json so synced machines
  // get prompted to install it.
  "livePreview.openPreviewTarget": "Embedded Preview",
  "livePreview.useIntegratedBrowser": true,
  // Apply a custom stylesheet to the built-in Markdown preview for nicer typography
  // and a brand palette. The colors are driven by --brand-* variables at the top of
  // the file — edit them directly, swap in one of the named presets, or run
  // /setup-environment to set them for you.
  "markdown.styles": [".vscode/markdown-preview.css"]
}
```

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
