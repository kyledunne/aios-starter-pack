# Guidance

Reference notes for specific AIOS setup tasks. Consult a file when the
relevant task comes up — they're material to draw on, not a script to
follow front-to-back.

## Index

- [git-practices.md](git-practices.md) — How to commit and push as the
  AIOS grows: the default of auto-committing every coherent change, and
  the handful of cases where it's wrong.
- [karpathy-wiki.md](karpathy-wiki.md) — The `raw/` / `wiki/` /
  `outputs/` folder pattern for turning a messy corpus into a
  structured, LLM-maintained knowledge base.
- [scratchpad.md](scratchpad.md) — The shared-file-plus-two-skills
  pattern (`/scratchpad` to capture, `/review-scratchpad` to work
  through) for catching ideas without derailing in-flight work.
- [set-up-codex.md](set-up-codex.md) — Adding the OpenAI Codex CLI as a
  second agent alongside Claude Code, sharing one `AGENTS.md`.
- [set-up-google-workspace.md](set-up-google-workspace.md) — Connecting
  Gmail, Drive, Sheets, Calendar, and Docs via the `gws` CLI: install,
  OAuth setup, scopes, and the known pre-1.0 gotchas.
- [set-up-playwright.md](set-up-playwright.md) — Giving the AIOS a
  headless browser for visual verification of frontend work.
- [set-up-printing-press.md](set-up-printing-press.md) — Minting an
  agent-native CLI for any service that doesn't ship one, via the
  Printing Press generator and pre-built library.
- [set-up-slack.md](set-up-slack.md) — Creating a per-AIOS Slack app
  with user-token scopes and wiring the token into the AIOS root
  `.env`.
- [working-directory.md](working-directory.md) — The
  `working/` + `working-archive/` pattern for organizing active work:
  one subfolder per in-flight task, archived by date when done.
- [more-guidance-online.md](more-guidance-online.md) — How to check the
  upstream starter-pack repo for newer guidance docs not in this local
  copy.
