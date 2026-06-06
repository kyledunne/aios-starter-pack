# Set up Playwright (headless browser CLI)

Gives the AIOS a real web browser — used by Claude/Codex to **visually
verify frontend work**: load a page, take screenshots at different
viewport sizes, generate PDFs, all without a browser window opening on
the user's monitor.

CLI over MCP, per the connection preference in `AGENTS.md` (CLI > API >
MCP). An MCP server for Playwright exists
([microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp))
and is loudly recommended in the Claude Code community, but it loads
~25 tools into every session for a capability the CLI delivers in a
single command. Start with the CLI; the MCP stays available as an
upgrade path if a real interactive use case ever shows up.

## What "headless" means

A **headless** browser is a real Chromium running with no visible
window — it loads the page, runs JavaScript, renders layout, all in
the background. Nothing appears on the user's monitor. The browser
draws to an in-memory framebuffer; the agent reads the result from the
saved screenshot file.

Headless is the default for every Playwright CLI command. No flag to
flip — if you want to *watch* a session, that's the territory of
writing a script with `{ headless: false }` (see *Escape hatches*
below).

## Install

Nothing repo-scoped. The CLI ships with the `playwright` npm package
and runs via `npx -y playwright@latest …` — no install step, `npx`
fetches it each run.

First use downloads Playwright's bundled Chromium (~112 MB) into a
local cache (`%LOCALAPPDATA%\ms-playwright\` on Windows, `~/.cache/ms-playwright/`
on macOS/Linux). To pre-cache:

```
npx -y playwright@latest install chromium
```

## Usage

### One-shot screenshot at a given viewport

```powershell
npx -y playwright@latest screenshot `
  --viewport-size "1280, 800" `
  http://localhost:3000/news `
  out.png
```

PowerShell line continuation is backtick; bash is backslash. Always
quote `--viewport-size` — the comma-space format requires it.

### Viewport sweep (responsive check)

Three calls cover most real-world breakpoints. Phone, tablet, desktop:

```bash
npx -y playwright@latest screenshot --viewport-size "375, 800"  http://localhost:3000/news phone.png
npx -y playwright@latest screenshot --viewport-size "768, 1024" http://localhost:3000/news tablet.png
npx -y playwright@latest screenshot --viewport-size "1280, 800" http://localhost:3000/news desktop.png
```

### Common useful flags

| Flag | What it does |
|---|---|
| `--full-page` | Capture the entire scrollable area, not just the viewport. |
| `--device "iPhone 13"` | Preset device emulation (overrides `--viewport-size`). Run `npx playwright devices` for the list. |
| `--wait-for-selector "<css>"` | Wait until a selector appears before snapping — useful for hydration-heavy pages. |
| `--wait-for-timeout <ms>` | Hard wait, when there's no good selector to anchor on. |
| `--color-scheme dark` | Emulate the `prefers-color-scheme: dark` media query. |
| `--ignore-https-errors` | For self-signed dev certs. |

Full reference: `npx playwright screenshot --help`.

### Other subcommands worth knowing

- `npx playwright pdf <url> <out>` — PDF rendering (Chromium only).
- `npx playwright codegen <url>` — opens a real browser window and
  records clicks/typing into a Playwright script. Useful for
  *generating* a flow to re-use as a script, not for automated runs.
- `npx playwright install <browser>` — pre-cache chromium / firefox /
  webkit.

## Escape hatches

The CLI is intentionally narrow — point-in-time captures, no session
state. When a task needs more, step *up*, don't swap tools:

- **Multi-step interactive flow** (click → screenshot → click →
  screenshot, or reading the rendered DOM) — write a small `.mjs`
  script that imports `playwright` as a library. Ten-ish lines:
  `chromium.launch()`, `newPage()`, `goto`, `click`, `screenshot`.
  Delete the script when done; no commit.
- **Repeated multi-step verification** that would be tedious to
  re-script every time — that's when reconsider the Playwright MCP
  server.

The progression mirrors the minimalism principle: start with the CLI;
graduate to a one-off script when one command isn't enough; graduate
to the MCP only when scripting is also too much. Don't carry
scaffolding you don't need.

## Notes

- No credentials. The Chromium binary lives outside the repo in the
  local Playwright cache and shouldn't be committed.
- Upstream: <https://playwright.dev/docs/test-cli>. The CLI page is
  test-runner-flavored; the bare `screenshot` / `pdf` / `codegen`
  subcommands are documented on the per-command help.
