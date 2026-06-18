# AIOS HTML Preview (bundled VS Code extension)

A deliberately tiny VS Code extension that makes `.html` files open as a
**rendered, interactive preview** instead of raw source — whether you click them
in the Explorer or in the **Claude Code chat panel** — so HTML artifacts your
AIOS produces (like [`planet-analogy.html`](../../planet-analogy.html)) open as a
page, not as code.

It ships **bundled with the pack** as a prebuilt `.vsix` because it isn't on the
VS Code Marketplace, so — unlike the marketplace extensions in
[`extensions.json`](../extensions.json) — it can't be auto-recommended. The
shipped `.vsix` is **inert until installed**.

## Install

```sh
code --install-extension .vscode/aios-html-preview/aios-html-preview-1.0.0.vsix --force
```

[`/setup-environment`](../../.claude/skills/setup-environment/SKILL.md) offers to
do this for you (run it on each machine — a `.vsix` install is per-machine, not
synced by git). Reload the window afterward (`Developer: Reload Window`).

## How it works

Two cooperating pieces, so `.html` renders no matter how it was opened
([extension.js](extension.js)):

1. **A custom editor** for `*.html` that renders the file in a sandboxed webview —
   injecting a `<base href>` so relative resources resolve and letting inline +
   CDN scripts run. Registered with `priority: "option"`, so it takes over
   Explorer / Quick Open opens only when [`settings.json`](../settings.json)
   associates `*.html` with it (the pack ships that association):

   ```json
   { "workbench.editorAssociations": { "*.html": "aios.htmlPreview" } }
   ```

2. **A tab-watcher** for the case associations can't reach: the **Claude Code
   chat panel** is a closed webview that bypasses `editorAssociations` and
   **force-opens source**. When an `.html` appears as an unexpected source tab,
   the extension closes it and reopens it rendered. Net effect: click an `.html`
   chat link, it opens as a page. (Brief source flash.)

"Reopen as source file" still works — a file just shown as preview and reopened
as source is treated as a deliberate downgrade and left alone.

## Reading source when you want it

- On a preview, click the **"Open Source"** button (go-to-file icon) in the
  editor title bar — it swaps that tab to source in place.
- Command Palette → **AIOS: Open This HTML as Source**.
- Turn it off: **AIOS: Toggle HTML Auto-Preview**, or set `htmlPreview.enabled`
  to `false`.

## What renders well

Self-contained pages: inline `<script>`/`<style>` + CDN tags (React, Tailwind,
etc.), and relative resources. Live-reloads when you edit in a split text editor.

## What won't

Pages needing a **real local server** (`fetch('/api/...')`, client-side routing).
For those, use the recommended **Live Preview** extension instead (server-backed);
the two are complementary. Live Preview registers no custom editor, so it can't
be a one-click default — which is why this exists.

Set `htmlPreview.debug` to `true` to log tab events and swap decisions to the
**"AIOS HTML Preview"** output channel.

## Rebuilding

```sh
cd .vscode/aios-html-preview
npx --yes @vscode/vsce package --no-dependencies
```

MIT licensed.
