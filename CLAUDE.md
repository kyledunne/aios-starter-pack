# CLAUDE.md — AIOS primer

You're helping someone build a personal AI operating system (AIOS).
This file is a short primer on what that is and the principles to
follow. Specifics for the user — who they are, what they connect to,
what they want automated — get built up over time, with them.

## What an AIOS is

A Personal AI Operating System is a plain-text repo that holds context
about its user, connects to the services they use, and grows workflows
on top — eventually running around the clock on their behalf. It's a
git repo of markdown, deliberately, so it's portable across tools (any
AI agent can read it) and not tied to any particular runtime.

## The four layers

Think of the AIOS as **four layers, inner to outer**. Each one builds
on the one before it; you don't skip ahead.

### Layer 1 — Core context

Who the user is. What they do day to day. The businesses, brands, and
clients they care about. The people they work with. Their goals and
priorities. The tone of voice they want the AIOS to write and speak in.

Everything downstream depends on the AIOS actually understanding who
it's working for, so this is where setup begins.

### Layer 2 — Extensions

What the AIOS reaches *outside* its own files:

- **Connections** — authenticated access to services the user works in:
  Gmail, Slack, GitHub, Google Drive, Calendar, whatever they use.
- **Tools** — general capabilities that don't carry the user's
  identity: a headless browser for visual verification, a CLI generator
  for services that don't ship their own.
- **References** — external knowledge bases the AIOS draws on (e.g. a
  curated index of YouTube tutorials on AI automation).

Connect to as much of the user's real workflow as you can. The more
the AIOS is wired into, the more of the user's work it can carry, and
the less they're jumping between tabs and tools.

### Layer 3 — Workflows

What the AIOS actually *does* — drafting a post, triaging a morning
inbox, taking a video from idea to upload. Workflows build on layers
1 and 2.

The rule: **never automate a big task all at once.** Break it into
sub-tasks. Automate a slice of each, with the human in the loop
reviewing. Grow the automated share over time — 20% becomes 50%
becomes 80%, until the user only steps in briefly.

### Layer 4 — Always-on

The AIOS operating 24/7/365, even when the user is away from the
computer. Examples:

- An AI executive assistant that responds to the user's coworkers in
  their voice, clearly identified as an assistant, at any hour.
- Talking to the AIOS from a phone via a messaging app like Telegram
  while out on a walk.
- Scheduled automations running in the cloud.

This is the payoff. Don't try to build it before layers 1–3 are real.

---

This framework is heavily inspired by **Nate Herk** — see his YouTube
channel for the underlying ideas:
<https://www.youtube.com/@nateherk>.

Another way to picture all of this: as the layers of a planet. Open
[`planet-analogy.html`](planet-analogy.html) for the visual.

## Minimalism

Keep the AIOS small. The instinct, once you start, is to fill the repo
with skills, instructions, context docs, and automations — much of it
scaffolding for capabilities the user doesn't yet need. Resist that.

Two reasons:

- **AI tools keep getting better.** As models improve, they need
  *less* scaffolding — fewer skills, fewer explicit instructions — to
  do the same work, because they can just do it. Something worth adding
  today may be dead weight in six months.
- **Don't add complexity until it's proven necessary.** Run bare-bones
  first. Add a skill, automation, or layer of context only when a real
  need has actually shown up.

The AIOS will grow. The discipline is that growth is *pulled by need*,
never *pushed by completeness*.

## Connections: prefer CLIs > APIs > MCPs

When wiring the AIOS to a service, the standing preference, best to
worst, is: a **CLI**, then a **documented API**, then an **MCP
server**.

An MCP server loads its full tool surface into the agent's context
every session — heavy weight for tools used only occasionally. A
documented API is leaner: you keep notes on just the endpoints you
actually use. A CLI is leaner still and is the agent's native
interface — the command line is where it already operates. Same
instinct as **Minimalism**: don't carry scaffolding you don't need.

(There are exceptions. Some services have only an MCP. Some CLIs are
weak enough that an API is better. Treat this as the default, not a
rule.)

## How to use this starter pack

The [`guidance/`](guidance/) folder holds setup notes for specific
pieces — Google Workspace via the `gws` CLI, Slack, Codex, Playwright,
Printing Press, plus general patterns (git habits, the scratchpad
idea). See [`guidance/README.md`](guidance/README.md) for a one-line
description of every file, and consult them when a relevant setup task
comes up. They're *reference material*, not a script to follow
front-to-back.

If you're working on a setup task this pack doesn't cover, check
[`guidance/more-guidance-online.md`](guidance/more-guidance-online.md)
— Kyle keeps adding guidance to the upstream repo as new territory
gets explored.
