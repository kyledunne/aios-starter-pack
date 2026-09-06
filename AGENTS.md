# AGENTS.md — AIOS primer

You're helping someone build a personal AI operating system (AIOS).
This file is a short primer on what that is and the principles to
follow. Specifics — who the user is, what they connect to, what they
want automated — get built up over time, with them.

If the user gives their AIOS a working name, answer to it.

This repo is **private, and always will be** — it holds the user's
personal context, work material, and connections. Secrets are a
separate matter: they stay in the gitignored `.env`, never committed
(see **Secrets**).

## A note on this starter pack

What you're reading is the **starter pack**: the machinery and recipes
for an AIOS — this primer, the [`guidance/`](guidance/) manual, the
[`skills/`](skills/), the [`advisors/`](advisors/), and the
configs — but **not** the user's content.
There are no `about-the-user/`, `goals-and-priorities/`,
`tools-and-connections/`, or `issues-and-solutions/` folders yet, and
that's deliberate: those are **born during setup**, from scratch, as the
[`/onboarding`](skills/onboarding/SKILL.md) and
[`/get-connected`](skills/get-connected/SKILL.md) flows run and as real
work turns up real snags. Creating them live — rather than filling in a
pre-made skeleton — is part of teaching the user (and you) that this repo
is built, not templated. So when this primer names a folder that isn't
here yet, that's the signal to **create it when the need arrives**, not a
missing piece.

## What an AIOS is

A Personal AI Operating System is a plain-text repo that holds context
about its user, connects to the services they use, and grows workflows
on top — eventually running around the clock on their behalf. It's a
git repo of markdown, deliberately: portable across tools (any AI agent
can read it) and not tied to any one runtime.

## The four layers

Think of the AIOS as **four layers, inner to outer**. Each builds on
the one before; you don't skip ahead.

**Layer 1 — Core context.** Who the user is, what they do day to day,
the businesses/brands/clients and people they work with, their goals and
priorities, and the tone of voice the AIOS should write and speak in.
Everything downstream depends on this, so setup begins here. Lives in
`about-the-user/` and `goals-and-priorities/` once `/onboarding` creates
them.

**Layer 2 — Extensions.** What the AIOS reaches *outside* its own files:

- **Connections** — authenticated access to services the user works in:
  Gmail, Slack, GitHub, Google Drive, Calendar, whatever they use.
- **Tools** — general capabilities that don't carry the user's identity:
  a headless browser for visual verification, a CLI generator for
  services that don't ship their own.
- **References** — external knowledge bases the AIOS draws on (e.g. a
  curated index of YouTube tutorials on AI automation). Raw, un-triaged
  external material (chat exports, archive dumps) can be staged in a
  gitignored `references/local-vault/` and distilled into the tracked
  repo as it's cleaned up — never committed wholesale.

Connections and tools live together in `tools-and-connections/` (created
by `/get-connected`); references live in `references/`. Wire in as much
of the user's real workflow as you can — the more it's connected to, the
more work it can carry, and the less the user is jumping between tabs.

**Layer 3 — Workflows.** What the AIOS actually *does* — drafting a
post, triaging a morning inbox, taking a video from idea to upload. The
rule: **never automate a big task all at once.** Break it into
sub-tasks, automate a slice of each with the human reviewing, and grow
the automated share over time — 20% becomes 50% becomes 80%, until the
user only steps in briefly.

**Layer 4 — Always-on.** The AIOS operating 24/7/365, even when the user
is away from the computer: an AI assistant answering coworkers in their
voice (clearly identified as an assistant) at any hour, a Telegram
thread to talk to it from a walk, scheduled automations in the cloud.
This is the payoff — don't build it before layers 1–3 are real.

This framework is heavily inspired by **Nate Herk**
(<https://www.youtube.com/@nateherk>). Another way to picture it: as the
layers of a planet — open [`planet-analogy.html`](planet-analogy.html)
for the visual.

## Minimalism

Keep the AIOS small. The instinct, once you start, is to fill the repo
with skills, instructions, context docs, and automations — scaffolding
for capabilities the user doesn't yet need. Resist it, for two reasons:

- **AI tools keep getting better.** As models improve they need *less*
  scaffolding to do the same work. What's worth adding today may be dead
  weight in six months.
- **Don't add complexity until it's proven necessary.** Run bare-bones
  first; add a skill, automation, or context doc only when a real need
  shows up.

Growth is *pulled by need*, never *pushed by completeness*. (This is also
why the starter pack ships no user-content folders — see the note above.)

## Folder structure: flat until it grows

The repo uses one structural pattern everywhere, and (per **Minimalism**)
it grows only when a real need pushes it:

- **Start flat.** A folder holds a `README.md` plus single Markdown files
  — one file per thing (`guidance/setup-slack.md`, one `SKILL.md` per
  skill, one snag per `issues-and-solutions/*.md`).
- **Grow a file into a folder when it outgrows one file.** When a single
  topic gets too big or picks up supporting files (a long stylesheet,
  images, sub-pages), replace `topic.md` with a folder `topic/` of the
  *same name*, holding a `README.md` plus those files — the README carrying
  the topic's content and linking out to them, rather than inlining, say,
  ~200 lines of CSS. Small snippets still belong inline; externalize only
  what's genuinely large. The reverse holds too: when a folder sheds its
  supporting files, it collapses back to a single `topic.md`.
- **Two kinds of README — don't conflate them.** An *index* README lists
  the **distinct sibling things** in a collection folder (the guidance
  docs, the skills, the issues). A *core-context* README **is the content**
  of one thing that grew into a folder — it reads top-to-bottom and links
  to its own supporting files; it does not index siblings.
- **It's recursive.** The same choice repeats at every level: a file
  inside a grown folder can itself later become a folder. Never pre-build
  the tree — keep it flat until a file is actually unwieldy, then split.

## When something breaks, write it down

When a setup step stalls, a command fails unexpectedly, or a workaround
turns out to be the real path — capture the symptom and the resolution
in the **right place**, in the same session, before moving on. "Fix it
now, document it later" means the next AIOS gets stuck on the same snag.
Where it goes depends on scope:

- **Bound to one connection, tool, or skill** → that connection or tool's own doc
  (`tools-and-connections/<service>.md`, or its folder once that bloats) or the relevant
  skill file — a tool's known quirks are part of its docs, so they live with it.
- **Cross-cutting / not owned by any one tool** → an `issues-and-solutions/`
  folder, one file per snag (symptom-first, then the fix), indexed in its
  README. Create the folder when the first cross-cutting snag arrives.
- **Machine-specific** → `local-setup.md`.

A snag you actually hit is the clearest signal of need there is.
(Generic, anyone-could-hit-it snags that the pack already knows about are
written up in [`guidance/`](guidance/) instead — e.g. commit hygiene with
concurrent agents lives in [`guidance/git-practices.md`](guidance/git-practices.md).)

## Connections: prefer CLIs > APIs > MCPs

When wiring the AIOS to a service, the standing preference is a **CLI**,
then a **documented API**, then an **MCP server**. An MCP loads its full
tool surface into context every session — heavy for tools used only
occasionally. An API is leaner (notes on just the endpoints you use); a
CLI is leaner still and is the agent's native interface. Same instinct
as **Minimalism**.

(Exceptions exist — some services have only an MCP, some CLIs are weak
enough that an API wins. Default, not a rule.)

## In-flight work: the working/ directory

Projects that are actively underway live in `working/`, one subfolder per
task — brainstorms, plans, and intermediate files together in one place.
It keeps the live surface of the repo small while work is still
half-formed. What makes it different from the rest of the repo is that
finished tasks don't linger — promote the real artifact to its permanent
home and move the folder into `working-archive/` by date. See
[`guidance/working-directory.md`](guidance/working-directory.md) for the
full pattern. (Both folders are born the first time a task starts.)

**`working/` is committed like everything else.** In-flight notes are
exactly the work you'd be sorriest to lose, and an AIOS that syncs itself
between machines has to carry them. For genuinely disposable output —
generated files, throwaway dumps, intermediate artifacts you'd regenerate
without a thought — use **`working/<task>/scratch/`**: every `scratch/`
folder, at any depth, is gitignored. The trade is the point, so read it
plainly: gitignored means **not synced and not backed up**. `scratch/` is
for output that is *disposable*, never for thinking that is merely
*unfinished*.

## Built automations: the automations/ directory

Once a workflow is **built and running** (layers 3–4 — a workflow the AIOS
*does*, or an always-on process), it lives in `automations/`, the
root-level home for all of them, **one subfolder per automation**. This is
the permanent counterpart to `working/`: `working/` holds half-formed scratch
that is eventually archived or thrown away; `automations/` holds finished,
in-service machinery that stays. Both are tracked and auto-committed.

Don't put an automation's engine code loose at the repo root — it belongs under
`automations/<name>/`. Each subfolder is self-contained: the engine code, its
runners/schedulers (e.g. the Windows task launchers), any bot front doors, and
its own ops doc (`<NAME>.md` / `BOT.md`) all live together.

**Relationship to [`skills/`](skills/):** a skill is *how an agent drives* a capability
(instructions, loaded on demand); an automation is *the machinery that runs* —
often headless, scheduled, or always-on. They commonly share a name and pair up:
the skill is the agent's front door, the `automations/<name>/` folder is the
engine and the unattended front doors (folder watchers, Slack bots, cron). For
example, a document-filing automation might pair a `/file-docs` skill (the
agent's front door) with an `automations/file-docs/` folder holding the filing
engine, a find-a-file Slack bot, and a folder-watching poller.

## Skills: the skills/ directory

A skill is a re-runnable procedure invoked as a slash command — one folder
per skill under [`skills/`](skills/), each holding a `SKILL.md` whose
frontmatter carries the description the agent sees and whose body is the
procedure. [`skills/README.md`](skills/README.md) indexes the ones the pack
ships.

**Top-level `skills/` is the single source of truth, and both agents are
bridged to it.** Claude Code only discovers skills under `.claude/skills/`,
and the OpenAI Codex CLI only under `.agents/skills/` — so each of those is
a **machine-local link** into `skills/`: a directory junction on Windows (no
admin rights needed), a plain symlink on macOS and Linux.

Both links are recreated at the start of every session by one cross-platform
Node script,
[`.claude/hooks/ensure-skills-link.mjs`](.claude/hooks/ensure-skills-link.mjs),
wired as a `SessionStart` hook from **both** agents — Claude Code via
[`.claude/settings.json`](.claude/settings.json) and Codex via
[`.codex/hooks.json`](.codex/hooks.json) — so whichever one starts first
heals both links. Node's `fs.symlinkSync(target, path, 'junction')` picks the
right kind of link per OS, which is why a single script covers every machine.
The script is conservative: a real directory with files at either path is left
alone and reported, and it always exits 0.

The links themselves are **gitignored** (`.claude/skills`, `.agents/skills`
— deliberately with no trailing slash, because a Linux symlink is not a
directory, so a `skills/` pattern would miss it and the link would get
committed). A fresh clone has neither until the first session creates them.
There's nothing to run by hand; if you ever need to, it's
`node .claude/hooks/ensure-skills-link.mjs`.

## Personas: the advisors/ directory

A skill is loaded *for a task*; an **advisor** is a persona that carries a
whole conversation. It's one Markdown file in [`advisors/`](advisors/) whose
body becomes that session's instructions — so instead of invoking a
procedure mid-chat, the user picks who they're talking to. Apps that read
`advisors/*.md` from the AIOS root (e.g. Planet You) surface them in a
persona picker and label the chat with the advisor's name.

The pack ships one:
[`advisors/onboarding-advisor.md`](advisors/onboarding-advisor.md) — the
guide that runs the Layer-1 opening interview and then stays on as the
"what's next" guide once the interview is done. From a terminal CLI the
same content is reachable as
[`/onboarding`](skills/onboarding/SKILL.md), which is a thin shell
pointing at it; the advisor file is the single source of the flow.

The folder is flat (one file per advisor, no README) until a second advisor
makes an index worth having — same rule as everything else here.

## How to use this starter pack

The [`guidance/`](guidance/) folder is the **general, untailored setup
manual** — Google Workspace (`gws`), Slack, Codex, Playwright, Printing
Press, VS Code, plus general patterns (git habits, the scratchpad, the
working/ pattern, and optional memory/skills junctions). Treat it as **read-only locally**:
it's owned upstream (the `aios-starter-pack` repo), drawn on through two
sanctioned flows — **sync-down** (pull newer docs from upstream) and
**contribute-up** (send a generalized, human-approved lesson back) — never
ad-hoc edits with this AIOS's own results. Tailored records go elsewhere: a
connection's setup and quirks, or a general capability (a tool), to
`tools-and-connections/`; a cross-cutting snag to an `issues-and-solutions/`
folder.

See [`guidance/README.md`](guidance/README.md) for the full split and a
one-line description of each doc; consult a doc when its task comes up
(it's reference, not a script). [`/whats-next`](skills/whats-next/SKILL.md)
runs the sync-down + suggest flow. For territory this pack doesn't cover,
check [`guidance/more-guidance-online.md`](guidance/more-guidance-online.md).

## Tracking machines and local setup

Two files, one tracked and one not (both born when the AIOS first runs on
a machine):

- **`devices.md`** (tracked, repo root) — the **roster** of every machine
  this AIOS runs on, high-level and secret-free. It's the **parity spec**
  that [`/setup-new-computer`](skills/setup-new-computer/SKILL.md)
  reads when bringing up a new machine.
- **`local-setup.md`** (gitignored, repo root) — the detail for *this*
  machine: installed versions, local auth state, file locations.

Update `local-setup.md` when you install or wire up something locally;
add a line to `devices.md` when a machine's capabilities change. On a new
machine, read `devices.md` for the parity target and run
`/setup-new-computer`.

## Secrets

Secrets and API tokens live in a single gitignored `.env` at the repo
root. When a workflow needs a credential, read it from there rather than
asking the user to paste it into chat — pasted secrets end up in
transcripts, which is exactly where they shouldn't be.

If `.env` doesn't exist, create it (already in `.gitignore`). If a needed
key isn't in it yet, tell the user which variable to add and where to get
it, then read it back once saved. Never commit `.env`, never echo its
full contents, and never copy a secret into another tracked file.

Because `.env` is gitignored, it doesn't travel across machines — keep
the canonical copy of each secret in a password manager. That's what
carries credentials to a new machine, not git and not chat.

## Git strategy: commit and push automatically

When a coherent unit of work is complete — even small ones like a single
scratchpad note — commit and push it automatically, without asking.
Keeping the AIOS synced across machines is the whole point of it being a
git repo, so this is the normal habit, not a per-change decision — and it
covers `working/` too, which used to be carved out and no longer is. See
[`guidance/git-practices.md`](guidance/git-practices.md) for the fuller
rationale and the edge cases where you should pause and confirm first.

**Unless something else is already committing this repo for you.** An AIOS
opened inside an app that syncs it — Planet You commits and pushes the whole
repo at every turn edge and on a timer — does not need agent commits at all:
routine ones spend turns and tokens on work that lands in git within the
minute regardless. Leave those to the sync and keep working. A deliberate
commit is still worth making where a coherent unit deserves its own message;
what to drop is the reflex after every change. In a plain terminal or editor
session nothing else is syncing the repo, so the habit above stands exactly
as written. **How to tell which you are in:** a `.planetyou/` folder at the
repo root means the space was scaffolded through Planet You and its Gravity
sync is running.

This includes **Claude memories** — *if* you've set up the optional memory
junction (see [`guidance/memory-junctions.md`](guidance/memory-junctions.md)).
With it, memories live in the repo's `memory/` folder and *are* tracked in git,
so commit and push them like any other coherent unit of work. Without it, Claude
keeps memory in its own local store outside the repo — there's nothing to commit.

**Expect company: multiple agents often run in this AIOS at once**
(worktrees would isolate them but are awkward in practice, so assume a
shared working copy). The habit that matters is **one agent per `working/`
project at a time** — two agents editing the same task folder collide over
the files themselves, which no commit discipline fixes.

Scoping each commit by explicit pathspec (`git commit -- <paths>` rather
than `git add -A` / `-a`) is a **courtesy, not a hard rule**: it makes for
tidier history, and it genuinely matters in the same sessions the habit above
does — a plain terminal or editor session with nothing else committing. Under
Gravity, a neighbouring agent sweeping your files into its commit costs you
nothing, because those files were going to be committed within the minute
anyway.
Full writeup: [`guidance/git-practices.md`](guidance/git-practices.md).
