# AIOS Starter Pack

A starter pack for building a personal AI operating system (AIOS), by
**Kyle Dunne**.

An AIOS is a plain-text git repo that holds context about you, connects to the
services you use, and grows workflows on top — until it's working on your behalf
around the clock. This pack is what you start from.

## What this is (and isn't)

It's **not** a fill-in-the-blanks template. A generic skeleton full of empty
`about-you/` and `goals/` folders doesn't save much real work — the structure,
the connections, and the workflows that matter all depend on the person, so a
pre-filled template tends to get abandoned and rebuilt anyway.

Instead, this pack ships the **machinery and the recipes**, and lets your actual
content be **created live, with you**:

- **A primer** ([`AGENTS.md`](AGENTS.md)) — what an AIOS is, the four layers it
  grows through, and the principles (minimalism, CLIs-over-MCPs, commit-and-sync)
  that keep it lean. Read by both Claude Code and Codex.
- **Skills** ([`.claude/skills/`](.claude/skills/)) — guided flows:
  `/onboarding` (set up who you are), `/get-connected` (wire in Gmail,
  Slack, …), `/setup-new-computer`, `/setup-environment` (tune your editor &
  agents — optional), `/whats-next`, `/dream` (tend the memory store),
  `/grill-me` (get interviewed to extract a plan), plus the `working/` task
  lifecycle (`/complete-working-task`, `/checkpoint-working-task`).
- **A setup manual** ([`guidance/`](guidance/)) — untailored, vendored notes for
  connecting services (Google Workspace, Slack, Playwright, …) and the patterns
  that hold it together (git habits, the working/ directory, directory
  junctions).
- **The conventions** — gitignore and secrets handling baked in from day one, so
  a fresh clone is safe to work in immediately. The one bit of editor polish that
  ships by default is a [`.vscode/`](.vscode/) folder — a brand-skinned VS Code
  Markdown preview plus recommended extensions — and only because it's **inert
  unless you open the repo in VS Code**, so it costs every other editor nothing
  (see [`guidance/setup-vscode.md`](guidance/setup-vscode.md)). Everything else
  *tool*-specific stays opt-in and unshipped — routing skills to Codex,
  cross-machine memory/skills junctions — documented in [`guidance/`](guidance/)
  and set up on request by
  [`/setup-environment`](.claude/skills/setup-environment/SKILL.md), so the pack
  stays agnostic about the tools you actually use.

The user-content folders — `about-<name>/`, `goals-and-priorities/`,
`tools-and-connections/` — aren't shipped. They're **born during onboarding**,
from scratch, because creating them with you (rather than handing you a skeleton
to fill in) is part of learning that the repo is yours to build and grow.

## Getting started

If you want to build your own AIOS, **reach out and I'll walk you through it
personally**: [kyle@kyledunne.ai](mailto:kyle@kyledunne.ai). We'll use this
pack as the starting point — clone it, open it (VS Code with the Claude Code
extension is my recommended path, but you can also use the Claude desktop app,
Codex desktop app, or one of many other options), and run `/onboarding`.

For the visual primer, open [`planet-analogy.html`](planet-analogy.html) in any
browser. (In VS Code, the Live Preview extension makes that one click — see
[`guidance/setup-vscode.md`](guidance/setup-vscode.md).)

---

*If you're an AI agent helping someone set up an AIOS from this pack, start with
[`AGENTS.md`](AGENTS.md) and consult [`guidance/`](guidance/) as needed.*
