---
name: whats-next
description: Survey upgrade options for the AIOS — sync guidance from the upstream starter pack, compare it against what's already set up here, and propose a few high-leverage next steps. Use when the user asks "what should we do next?" or wants to level up / upgrade the AIOS.
---

# What's next — survey upgrade options from guidance

This skill answers "what should we do next with the AIOS?" by reading the
general [`guidance/`](../../../guidance/) library against what's actually
set up here, and proposing a few concrete next steps.

`guidance/` is the untailored manual vendored from the upstream starter
pack (see [guidance/README.md](../../../guidance/README.md)). It's drawn on
through two sanctioned flows — **sync-down** and **contribute-up** — and
this skill is where both run. The core of the skill is sync-down + suggest
(steps 1–4); contribute-up (step 5) is a light, human-gated add-on.

## Steps

### 1. Sync-down — refresh guidance from upstream

Pull the latest starter pack into a scratch dir (don't touch the local
copy yet) and diff it against `guidance/`:

```
git clone --depth 1 https://github.com/kyledunne/aios-starter-pack.git <scratch>/aios-starter-pack-latest
```

Compare the two `guidance/` folders. Report:

- **New** docs upstream that aren't local yet.
- **Changed** docs (local exists but upstream differs).

For anything relevant, offer to copy it down into `guidance/`. Apply only
what the user okays — this is the *one* sanctioned way `guidance/` gets
written locally. If upstream is unreachable, say so and carry on with the
local copy (the comparison below still works).

### 2. Inventory what's set up here

Build a quick picture of the AIOS's current state — read enough to know
what's real, not exhaustively:

- `tools-and-connections/` — which services are wired in (connections) and
  which general capabilities are stood up (tools).
- `skills/` — what workflows exist.
- `devices.md` — machine roster / parity.
- The four layers in [AGENTS.md](../../../AGENTS.md) — how far out the AIOS
  has been built.

### 3. Compare guidance ↔ reality

For each guidance topic, classify it **done / partial / not started** by
checking for its tailored record:

- `setup-google-workspace.md` → `tools-and-connections/google-workspace.md` exists → **done**
- `setup-slack.md` → `tools-and-connections/slack.md` exists → **done**
- `setup-playwright.md` → no `tools-and-connections/playwright.md` → **not started**

(The presence of the *tailored* doc — in `tools-and-connections/` — is
the signal, not anything in `guidance/` itself.)

### 4. Propose a few next steps

Present **about three** concrete options, ranked by leverage. Rules:

- **Respect the four layers.** Don't propose a Layer-4 capability before
  Layers 1–3 are real. Walk outward, not ahead.
- **Honor minimalism.** Each option names the *need* it serves — the real
  workflow it unlocks or friction it removes. If nothing actually pulls a
  capability, don't suggest it just because guidance covers it. Growth is
  pulled by need, never pushed by completeness.
- **Tie each to its guidance doc**, so the user can read the recipe before
  committing.
- **Infrastructure counts too.** Beyond connections, a high-leverage step can be
  plumbing — e.g. the optional memory/skills junctions
  ([`memory-junctions.md`](../../../guidance/memory-junctions.md)) that sync
  Claude's memory across machines and let Codex share the skills folder. Surface
  it when the user gets a second machine or starts running Codex — pulled by that
  need, not before.

Let the user pick. The chosen one becomes a `working/` task; when it's a
setup, its tailored record lands in `tools-and-connections/` (and any
cross-cutting snag in an `issues-and-solutions/` file) — **not** back in
`guidance/`.

### 5. (Optional) Contribute-up — surface lessons worth sending upstream

Scan for lessons flagged as upstream candidates — frontmatter
`upstream: candidate` in `issues-and-solutions/` entries or connection docs.
For each one, this is the **human-gated** flow:

1. **Generalize** it to zero user-specifics — strip names, paths, org,
   private context; keep only the general symptom → fix. Provenance may say
   "surfaced setting up X on Windows," nothing identifying.
2. **Show the user the cleaned version** and get explicit approval. This repo
   is private and stays private; nothing leaves without a human saying yes.
3. On approval, open a PR to the upstream repo (or hand the user the cleaned
   text to send to <kyle@kyledunne.ai>).

Keep this half **deliberately light for now** — surface candidates and
generalize on request; don't build automated submission machinery until
there's a real queue and a second AIOS consuming the pack.

### 6. Confirm to the user

One short summary: what (if anything) was synced down, the proposed next
steps, the one they picked (now a `working/` task), and any contribute-up
candidates surfaced. Then stop.

## What not to do

- Do **not** overwrite local `guidance/` files without the user's ok — the
  scratch clone is for diffing, the copy-down is opt-in per file.
- Do **not** propose next steps that skip layers, or that nothing in
  the user's actual workflow needs. A long menu of possible setups is noise;
  three well-justified options are the deliverable.
- Do **not** auto-submit contribute-up items. Every outbound lesson is
  generalized and human-approved, because the repo is private.
- Do **not** write this AIOS's tailored results into `guidance/`. Those go
  to `tools-and-connections/` / `issues-and-solutions/`.
