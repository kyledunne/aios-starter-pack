# AIOS Markdown Auto-Preview (bundled VS Code extension)

A deliberately tiny VS Code extension: when a Markdown file opens as **source**,
it reopens it as **rendered preview**. It exists for the one case the `*.md`
editor association can't fix — clicking a `.md` link inside the **Claude Code
chat panel**, which force-opens source and ignores
[`settings.json`](../settings.json).

It's the Markdown counterpart to
[`aios-html-preview`](../aios-html-preview/README.md): both make the artifacts
your AIOS produces open the way you actually want to read them, in one click. It
ships **bundled** as a prebuilt `.vsix` because it isn't on the VS Code
Marketplace — so, unlike the marketplace extensions in
[`extensions.json`](../extensions.json), it can't be auto-recommended. It's
**inert until installed**.

## The problem it solves

The pack already sets `"*.md": "vscode.markdown.preview.editor"` in
[`settings.json`](../settings.json), so Markdown opens rendered from the
Explorer, Quick Open, etc. But the Claude Code chat panel is a closed webview
that **bypasses that association and force-opens source**. No setting reaches
it; the only lever left is to react *after* the file opens — which is what this
does.

## Install

```sh
code --install-extension .vscode/aios-markdown-auto-preview/aios-markdown-auto-preview-1.0.0.vsix --force
```

[`/setup-environment`](../../.claude/skills/setup-environment/SKILL.md) offers to
do this for you (run it on each machine — a `.vsix` install is per-machine, not
synced by git). Reload the window afterward (`Developer: Reload Window`).

## How it works

It watches the editor tabs (`window.tabGroups.onDidChangeTabs`). When a Markdown
file appears as a **source** editor it didn't expect, it closes that tab and
reopens the same file with VS Code's built-in rendered preview editor. Net
effect: click a link, it opens rendered. (Brief sub-100ms source flash.)

It distinguishes intent **structurally**, not by timing, so editing source still
works: a file it *just* showed as preview, reopened as source, is a deliberate
downgrade ("Reopen as source file") and is left alone. Unlike
[`aios-html-preview`](../aios-html-preview/README.md), it registers **no custom
editor** — it leans on VS Code's own Markdown preview, so it works even without
the `*.md` association (pairing them just removes the flash on Explorer opens).

## Reading source when you want it

- On a preview, click **"Reopen as source file"** — it sticks.
- Command Palette → **AIOS: Open This Markdown as Source**.
- Turn it off entirely: **AIOS: Toggle Markdown Auto-Preview**, or set
  `markdownAutoPreview.enabled` to `false`. (Worth doing if you edit `.md`
  source a lot; leave it on for read-mostly use.)

## Known limits

- **Markdown only.** (HTML chat links are a separate, worse upstream bug — they
  currently do nothing on Windows — so this can't help there.)
- **Brief source flash** as the swap happens — unavoidable with a reactive swap.
- **Fights deliberate *cold* source opens** (it can't tell them from a forced
  one); the escape hatches above cover it.

Set `markdownAutoPreview.debug` to `true` to log every tab event and swap
decision to the **"AIOS Markdown Auto-Preview"** output channel.

## Rebuilding

```sh
cd .vscode/aios-markdown-auto-preview
npx --yes @vscode/vsce package --no-dependencies
```

MIT licensed.
