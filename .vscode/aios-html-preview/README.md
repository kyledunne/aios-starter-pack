# AIOS HTML Preview (bundled VS Code extension)

A deliberately tiny VS Code extension that opens `.html` files as a **rendered,
interactive preview** in one click, instead of showing their source — so HTML
artifacts your AIOS produces (like [`planet-analogy.html`](../../planet-analogy.html))
open as a page, not as code.

It ships **bundled with the pack** as a prebuilt `.vsix` because it isn't on the
VS Code Marketplace, so — unlike the marketplace extensions in
[`extensions.json`](../extensions.json) — it can't be auto-recommended. It's
**inert until installed**.

## Install

```sh
code --install-extension .vscode/aios-html-preview/aios-html-preview-0.1.0.vsix --force
```

[`/setup-environment`](../../.claude/skills/setup-environment/SKILL.md) offers to
do this for you (run it on each machine — it's a per-machine VS Code install, not
synced by git).

## How it works

Registers a VS Code **custom editor** for `*.html` (~90 lines,
[extension.js](extension.js)) that renders the file in a sandboxed webview,
injecting a `<base href>` so relative resources resolve and letting inline + CDN
scripts run. It's registered with `priority: "option"`, so it does nothing until
[`settings.json`](../settings.json) associates `*.html` with it:

```json
{ "workbench.editorAssociations": { "*.html": "aios.htmlPreview" } }
```

That association already ships in the pack. To edit an HTML file's source
instead: right-click → **Open With… → Text Editor**.

## What renders well

Self-contained pages: inline `<script>`/`<style>` + CDN tags (React, Tailwind,
etc.), and relative resources. Live-reloads when you edit in a split text editor.

## What won't

Pages needing a **real local server** (`fetch('/api/...')`, client-side routing).
For those, use the recommended **Live Preview** extension instead (server-backed);
the two are complementary. Live Preview registers no custom editor, so it can't
be a one-click default — which is why this exists.

## Rebuilding

```sh
cd .vscode/aios-html-preview
npx --yes @vscode/vsce package --no-dependencies
```

MIT licensed.
