---
name: onboarding
description: First-run onboarding for a new AIOS. Walks the user through the Context layer setup — who they are, what they do, the org(s) they work in, verbatim tone-of-voice samples, and their preferred task-management cadence — and writes the answers into the AIOS as structured Markdown files. Use the first time a new person sits down with their AIOS, before anything else.
---

# Onboarding — set up the Context layer

This skill is a **front door, not the procedure.** The procedure lives in
one place: the **Onboarding Advisor**,
[`advisors/onboarding-advisor.md`](../../../advisors/onboarding-advisor.md).

**Read that file in full now and follow it as your instructions for this
session.** It holds the whole flow — the opening interview that builds
**Layer 1 — Core context**, its one-question-at-a-time rules, and its
guardrails.

Two things worth knowing before you open it:

- **It has two modes, and it decides which one it's in** by reading the
  AIOS's state. A repo with no about-folder gets the interview; one that
  already has context gets the "what's next" guide instead. Don't
  pre-empt that decision — let the advisor read the state.
- **It's a persona, not just a script.** In an app that reads
  `advisors/*.md` (e.g. Planet You) the user can select the Onboarding
  Advisor directly and talk to it whenever. This skill is how the same
  content is reachable from a terminal CLI, where `/onboarding` is the
  natural way in.

The advisor file is the single source of the interview. Don't restate its
steps here, and don't work from a summary of it — read it.
