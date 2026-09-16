# AIOS operating kernel

You are working inside a personal AI operating system: a private, portable git
repository of plain files that holds a person's context, connections, workflows,
and eventually always-on automations. The repository starts small and grows only
when real use creates a need.

This file is the always-loaded kernel. Read deeper documentation only when the
current task needs it. Start with [README.md](README.md); task-specific reference
material is indexed in [guidance/README.md](guidance/README.md).

## Core principles

- **Minimal context.** Keep always-loaded instructions and memory small. Put
  detail behind concise landing pages and load it on demand.
- **Plain files are the source of truth.** Prefer durable Markdown and portable
  formats over state trapped inside one app or model provider.
- **Growth is pulled by need.** Do not pre-build folders, skills, or automations
  merely for completeness.
- **Start flat.** A folder begins as a README plus one file per thing. Grow a
  file into a same-named folder only when it genuinely needs supporting files.
- **Prefer CLIs, then documented APIs, then MCP servers.** This is a default,
  not doctrine; use the lightest reliable connection that fits the job.
- **Externalize important state.** Plans, decisions, and resumable progress
  belong on disk, not only in a conversation window.

## The four layers

1. **Context:** who the user is, their work, relationships, goals, preferences,
   and voice.
2. **Extensions:** account-backed connections, general tools, and reference
   knowledge.
3. **Workflows:** repeatable work, first with human review and later with more
   automation as the process proves itself.
4. **Always-on:** scheduled or remotely reachable machinery. Build this only
   after the earlier layers are real and stable.

The starter pack intentionally contains machinery and guidance, not empty
user-content scaffolding. `/onboarding` and `/get-connected` create the person's
actual structure as it becomes known.

## Routing

- `README.md` — map of the starter pack and first-run route.
- `guidance/` — on-demand standards and setup references; see its README.
- `skills/` — reusable agent procedures, one folder and `SKILL.md` each.
- `advisors/` — conversation personas whose bodies become startup context.
- `working/` — active tasks, one folder each; created with the first real task.
- `working-archive/` — completed task records; created on first archive.
- `automations/` — finished, running machinery; never an empty aspirational
  folder.
- `memory/` — optional repo-backed cross-session memory once configured.
- `devices.md` — tracked, non-sensitive machine roster and parity target.
- `local-setup.md` — gitignored details for the current machine.
- `.env` — gitignored secrets and tokens.

When a project grows large, keep its current README short: what it is, current
state, active work, code/data location, and links to deeper docs. Put project
tasks under that project's own `working/`; reserve root `working/` for
AIOS-wide or standalone tasks.

## Skills and selected context

The top-level `skills/` folder is the source of truth. Session-start hooks link
it into both Claude Code and Codex discovery locations. Skill descriptions are
short routing metadata; procedures live in their bodies and load only when
needed. Natural-language invocation is the default. For rare explicit-only
skills, use both provider controls documented in
[guidance/context-and-maintenance.md](guidance/context-and-maintenance.md).

An advisor or agent is selected for a whole conversation. Keep its distinct
persona and standing context there; keep repeatable procedures in skills rather
than duplicating them in persona files.

## Work and safety

Create a `working/<task>/` folder for non-trivial work. Tracked in-flight notes
are valuable state, not disposable clutter. Put only regenerable dumps and
build output under a `scratch/` folder; `scratch/` is gitignored, unsynced, and
not backed up. Follow [guidance/working-directory.md](guidance/working-directory.md).

Protect the user's information and work:

- Never commit secrets, tokens, full credentials, or sensitive local paths.
- Read secrets from `.env`; ask the user to place missing values there rather
  than pasting them into chat.
- Treat third-party and client files as private; confirm their intended tracked
  or gitignored home before committing them.
- Preserve user-authored capture files unless the user explicitly authorizes
  rewriting or deletion.
- Before destructive or high-consequence actions, resolve exact targets and
  verify the requested scope.
- After an interrupted external call, inspect state before retrying; the first
  attempt may have succeeded.

Record a non-trivial snag where a future agent will look: with its connection or
skill when local to one mechanism, in an issues/troubleshooting folder when
cross-cutting, or in `local-setup.md` when machine-specific.

## Git and multiple agents

Expect a shared working copy. Preserve unrelated changes and avoid two agents
editing the same working task. Prefer commits scoped to your own paths.

In a normal terminal or editor session, commit and push each coherent completed
unit. In Planet You, Gravity already commits and pushes at turn edges and on a
timer, so routine agent commits are redundant; make a deliberate commit only
when a unit deserves its own message. Full details are in
[guidance/git-practices.md](guidance/git-practices.md).

## Context maintenance

Use `/dream` for the memory store only. Use `/clean-up-aios` for a whole-repo
context, routing, and structural audit. Whole-AIOS cleanup must inspect first,
record its findings, settle material choices with the user, and receive explicit
approval of a written plan before editing.
