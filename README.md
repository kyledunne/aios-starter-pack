# AIOS Starter Pack

A starter pack for building a personal AI operating system (AIOS), by
**Kyle Dunne**.

An AIOS is a folder of plain-text notes, kept in git, that holds context about
you, connects to the services you use, and grows workflows on top — until it's
working on your behalf around the clock. This pack is what you start from.

## What this is (and isn't)

It's **not** a fill-in-the-blanks template. A generic skeleton full of empty
`about-you/` and `goals/` folders doesn't save much real work — the structure,
the connections, and the workflows that matter all depend on the person, so a
pre-filled template tends to get abandoned and rebuilt anyway.

Instead, this pack ships the **machinery and the recipes**, and lets your actual
content be **created live, with you**:

- **A short kernel** ([`AGENTS.md`](AGENTS.md)) — the rules every agent reads
  first: the four layers an AIOS grows through, and the principles (minimalism,
  CLIs-over-MCPs, commit-and-sync) that keep it lean. Read by both Claude Code
  and Codex.
- **Skills** ([`skills/`](skills/)) — guided flows:
  `/onboarding` (set up who you are), `/get-connected` (wire in Gmail,
  Slack, …), `/whats-next`, `/sync`, `/dream` (tend the memory store),
  `/clean-up-aios` (approval-gated whole-repo maintenance), `/grill-me` (get
  interviewed to extract a plan), the `working/` task lifecycle
  (`/complete-working-task`, `/checkpoint-working-task`), and three setup
  flows for terminal users and developers: `/first-time-setup` (the first
  computer; Planet You does this for you), `/setup-new-computer`, and
  `/setup-environment` (tune your editor and agents — optional).
- **An advisor** ([`advisors/`](advisors/)) — a persona that carries a whole
  conversation rather than a single task. One ships: the **Onboarding
  Advisor**, which runs the setup interview and then stays on as the guide
  you ask "what's next?". Planet You opens it by itself when setup finishes,
  and you can pick it again any time; from a terminal it's `/onboarding`.
- **A setup manual** ([`guidance/`](guidance/)) — untailored, vendored notes for
  connecting services (Google Workspace, Slack, Playwright, …) and the patterns
  that hold it together (git habits, the working/ directory, the optional
  memory junction, and context/maintenance standards).
- **The conventions** — gitignore and secrets handling baked in from day one, so
  a fresh clone is safe to work in immediately. The one bit of editor polish that
  ships by default is a [`.vscode/`](.vscode/) folder — a brand-skinned VS Code
  Markdown preview plus recommended extensions — and only because it's **inert
  unless you open the repo in VS Code**, so it costs every other editor nothing
  (see [`guidance/setup-vscode.md`](guidance/setup-vscode.md)). Everything else
  *tool*-specific stays opt-in and unshipped — the cross-machine memory
  junction — documented in [`guidance/`](guidance/)
  and set up on request by
  [`/setup-environment`](skills/setup-environment/SKILL.md), so the pack
  stays agnostic about the tools you actually use.

The user-content folders — `about-<name>/`, `goals-and-priorities/`,
`tools-and-connections/` — aren't shipped. They're **born during onboarding**,
from scratch, because creating them with you (rather than handing you a skeleton
to fill in) is part of learning that the repo is yours to build and grow.

## Getting started

**With Planet You** (the main way in): Planet You, my desktop app, creates
your AIOS from this pack during its setup, signs in your AI accounts, and opens
the Onboarding Advisor to get to know you. To get Planet You, or to have me
walk you through it personally, email
[kyle@kyledunne.ai](mailto:kyle@kyledunne.ai).

**From a terminal or editor:** clone this pack, open it with Claude Code or
Codex (VS Code with the Claude Code extension works well), and run
`/first-time-setup` to get your environment going, then `/onboarding`.

For the visual primer, open [`planet-analogy.html`](planet-analogy.html) in any
browser. (In VS Code, the Live Preview extension makes that one click — see
[`guidance/setup-vscode.md`](guidance/setup-vscode.md).)

---

*If you're an AI agent helping someone set up an AIOS from this pack, start with
[`AGENTS.md`](AGENTS.md) and consult [`guidance/`](guidance/) as needed.*
