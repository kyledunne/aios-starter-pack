---
name: onboarding
description: First-run onboarding for a new AIOS. Walks the user through the Context layer setup — who they are, what they do, the org(s) they work in, verbatim tone-of-voice samples, and their preferred task-management cadence — and writes the answers into the AIOS as structured Markdown files. Use the first time a new person sits down with their AIOS, before anything else.
---

# Onboarding — set up the Context layer

This skill is the first thing a new AIOS user runs. It builds **Layer 1
— Core context** (see [`AGENTS.md`](../../../AGENTS.md)) by walking
through a short conversation and writing the answers into the repo as
Markdown files the AIOS reads on every future session.

Everything downstream depends on the AIOS actually understanding who
it's working for, so this is where setup begins. Don't skip ahead to
connections or workflows until this is done.

## Tone

You're a friendly setup guide, not a form. The user is probably
non-technical and probably nervous they'll do this "wrong". They
won't. Reassure them up front that:

- Everything you write here is just Markdown — it can be edited any
  time, by them or by you.
- This is a starting point, not a final version. The AIOS grows over
  time; today's pass just needs to be honest enough to be useful.
- They can pause, come back later, or skip any question. No question
  is required.

Keep the conversation **one question at a time**. Wait for an answer
before moving on. Don't fire off a numbered list of every question up
front — that's overwhelming, and it's the opposite of how a real
onboarding conversation feels.

## Flow

### 1. Welcome

A short message: what an AIOS is in one sentence (a personal AI
operating system, kept as a plain-text repo, that gets to know them
and works on their behalf over time), and what this session will
cover (five quick questions, about 10–15 minutes). Then ask the
first question.

### 2. Name

> "First — what should I call you? Just a first name is fine."

Use it to name the about-folder: lowercase, kebab-case — `about-sam/`,
`about-jordan/`, `about-maria-sofia/`. From here on, that's the path
you'll write context files into. Confirm the folder name back to them
casually so it's not a surprise later: "Got it — I'll keep everything
about you in an `about-<name>/` folder."

### 3. About you

> "In a few sentences — who are you, and what do you do day to day?"

Open-ended on purpose. Let them ramble. Capture whatever they say into
`about-<name>/bio.md` as prose, lightly cleaned up but staying close
to their words. Don't editorialize, don't invent details, don't ask
twelve follow-up questions — one or two clarifying questions max if
something is genuinely unclear.

### 4. Org(s) and role

> "Tell me about the organisation (or organisations) you work in, and
> your role(s). One or several is fine — just describe what makes
> sense for you."

Some people work for one company; some have a day job plus a side
project; some are founders running multiple things. Adapt:

- **One org** — write `about-<name>/org.md` describing the org and
  their role in it.
- **Multiple orgs** — write `about-<name>/orgs/` as a folder with one
  file per org (`<org-slug>.md`), plus a short `orgs/README.md` index.

Either way, include: what the org does, the user's role / title /
function, who they report to or work most closely with (names only,
not full bios — that's a later context-layer pass if it's useful).
Don't fabricate details they didn't give you.

### 5. Tone of voice — verbatim samples

> "The AIOS will eventually draft emails, posts, and messages on your
> behalf, so it needs to learn how you actually write. Could you paste
> in 2–3 short samples of your own writing? They can be anything — an
> email you sent, a Slack message, a LinkedIn or social post. The more
> *verbatim* the better."

The point is samples, not a self-description. People are bad at
describing their own voice; a model learning from real text is much
better than a model learning from "I'm casual but professional".

Write `about-<name>/tone-of-voice.md` with:

- A short **Status** note that this is a first pass built from a small
  sample, and the observations are provisional.
- 2–4 short bullet observations *only if* they fall out of the samples
  obviously (e.g. "rarely uses contractions", "no em-dashes",
  "sentences open with 'And' sometimes"). If the sample is too small
  to support real observations, say so — don't invent fingerprints.
- A **Verbatim samples** section at the bottom with each sample
  reproduced exactly as they pasted it, with a short header for
  context ("Email to a client, May 2026", "LinkedIn post, Jan
  2026").

If the user can only think of one sample right now, write what they
gave you and note "more samples to be added over time" — don't push.

### 6. Task-management cadence

> "Last one — how do you want to organise your goals and to-dos? Three
> options:
>
> - **Monthly sprints** — one folder per month (e.g. `2026-05-may/`),
>   each holding the goals for that month. Good if you naturally
>   think in terms of "this month I want to…".
> - **Quarterly sprints** — one folder per quarter (e.g. `2026-Q2/`).
>   Good if your work moves on longer arcs and a month feels too
>   granular.
> - **Custom / decide later** — skip for now, and we'll set up the
>   structure when you have a clearer sense of what fits.
>
> Which feels right? It's easy to change later — you're not locked in."

Based on the answer, scaffold `goals-and-priorities/`:

- **Monthly:** create `goals-and-priorities/README.md` explaining the
  cadence (one subfolder per month, naming convention
  `YYYY-MM-month`), and create the current month's folder with a stub
  `README.md` and an empty `to-do.md`.
- **Quarterly:** same shape but with `YYYY-Qn` naming, and the current
  quarter's folder.
- **Custom / later:** skip the folder entirely. Mention you'll
  revisit when they're ready.

Keep the explanation in `goals-and-priorities/README.md` short — a few
sentences and the naming convention. The user can grow it.

### 7. Wrap up

Confirm what was written: list the files you created (with relative
paths so they can click through), and tell them what's next:

> "That's the Context layer started. The natural next step is **Layer
> 2 — Connections**: wiring the AIOS into the services you actually
> use (Gmail, Slack, etc.). When you're ready, run `/get-connected`
> and we'll start with Google Workspace and Slack."

Optionally, mention `/setup-environment` — a separate, run-anytime skill
that tailors the repo to *your* tools (a brand-skinned Markdown preview in
VS Code, adding Codex as a second agent, syncing across machines). It's
purely about the dev environment, not the AIOS's content, so it's entirely
optional — flag it as something they *can* do, not a step they need to take
now.

Then commit and push everything as one coherent unit (see
[`guidance/git-practices.md`](../../../guidance/git-practices.md)).
Commit message: `Onboarding: initial Context layer for <name>`.

## What not to do

- **Don't ask all the questions in one message.** One at a time, in
  order. Wait for the answer.
- **Don't invent details.** If the user didn't say it, don't write
  it. Better to have a thin file than a confidently wrong one.
- **Don't lecture about AIOS theory.** They can read
  [`AGENTS.md`](../../../AGENTS.md) and the planet-analogy primer if
  they want depth. This skill is the doing, not the explaining.
- **Don't push for completeness.** "Skip" is always a valid answer.
  Anything they skip can be filled in later — and probably will be,
  the moment they hit a task where it would have been useful.
- **Don't run any of the connection-setup tasks here.** Those belong
  to `/get-connected` and the individual setup guides. This skill
  builds Layer 1 only.
