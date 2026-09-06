# Guidance

Reference notes for specific AIOS setup tasks. Consult a file when the
relevant task comes up — they're material to draw on, not a script to
follow front-to-back.

## Index

- [git-practices.md](git-practices.md) — How to commit and push as the
  AIOS grows: the default of auto-committing every coherent change
  (`working/` included), the cases where it's wrong — including a
  Planet You space, where the app's own sync already commits everything
  — and keeping commits tidy when multiple agents share one repo.
- [memory-junctions.md](memory-junctions.md) — The per-machine directory
  junction (Windows) / symlink (macOS/Linux) that syncs Claude's memory into
  a tracked `memory/` folder. *Optional*, and a good thing to reach for once
  you have a second machine. (The sibling skills links are **not** optional —
  the pack wires those up for both agents automatically; see **Skills** in
  [`../AGENTS.md`](../AGENTS.md).)
- [karpathy-wiki.md](karpathy-wiki.md) — The `raw/` / `wiki/` /
  `outputs/` folder pattern for turning a messy corpus into a
  structured, LLM-maintained knowledge base.
- [scratchpad.md](scratchpad.md) — The shared-file-plus-two-skills
  pattern (`/scratchpad` to capture, `/review-scratchpad` to work
  through) for catching ideas without derailing in-flight work.
- [setup-codex.md](setup-codex.md) — Adding the OpenAI Codex CLI as a
  second agent alongside Claude Code, sharing one `AGENTS.md`.
- [setup-google-workspace.md](setup-google-workspace.md) — Connecting
  Gmail, Drive, Sheets, Calendar, and Docs via the `gws` CLI: install,
  OAuth setup, scopes, and the known pre-1.0 gotchas.
- [setup-playwright.md](setup-playwright.md) — Giving the AIOS a
  headless browser for visual verification of frontend work.
- [setup-printing-press.md](setup-printing-press.md) — Minting an
  agent-native CLI for any service that doesn't ship one, via the
  Printing Press generator and pre-built library.
- [setup-slack.md](setup-slack.md) — Creating a per-AIOS Slack app
  with user-token scopes and wiring the token into the AIOS root
  `.env`.
- [setup-vscode.md](setup-vscode.md) — The `.vscode/` folder for VS Code
  users: recommended extensions, the Markdown-opens-as-preview settings,
  and a brand-skinned Markdown stylesheet with named palettes. It **ships
  by default** — inert unless you open the repo in VS Code — so this doc
  covers what's in it and how to switch palettes, disable, or rebrand.
- [working-directory.md](working-directory.md) — The
  `working/` + `working-archive/` pattern for organizing active work:
  one subfolder per in-flight task, archived by date when done; plus the
  VS Code folder-lock snag and the `references/local-vault/` staging
  convention.
- [more-guidance-online.md](more-guidance-online.md) — How to check the
  upstream starter-pack repo for newer guidance docs not in this local
  copy.
