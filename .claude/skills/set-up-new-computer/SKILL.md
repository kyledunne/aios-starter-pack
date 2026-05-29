---
name: set-up-new-computer
description: Bring the AIOS up on a new machine so it matches the others — install the toolchain, restore connections, and register the machine in devices.md. Use when setting up the AIOS on a computer for the first time. Walks the full flow: bare-metal bootstrap (git, an agent CLI, clone), toolchain install, secrets from the password manager, per-connection bring-up, and recording the machine.
---

# Set up the AIOS on a new computer

This skill brings a fresh machine up to parity with the user's other AIOS
machines: the toolchain installed, every connection live, and the machine
registered in `devices.md`.

## The mental model

Most of an AIOS's outside identity is **cloud-side and shared** — it is *not*
recreated per machine:

- the OAuth clients (one per service, per org or user),
- the Slack app and its user token,
- the GitHub accounts, the hosting team.

What a new machine needs is the **local stores** that point at that shared
identity: a credential pasted into `.env`, a `client_secret.json` placed on
disk, a refresh token minted by a browser login. So the rule throughout is
**reuse the cloud identity, re-place or re-mint the local store.** You almost
never create a new app, project, or OAuth client when onboarding a machine.

## Read this first

- **Bootstrap is chicken-and-egg.** This skill lives *in* the repo, so it can
  only run once the agent CLI is alive inside the cloned repo. **Phase 0** is
  the bare-metal bring-up a human does first; the agent drives from **Phase 1**
  on. When you run this skill, treat Phase 0 as "verify it's done," then
  proceed.
- **Secrets come from the password manager** — never email, paste into chat, or
  commit them. See [`CLAUDE.md` → Secrets](../../../CLAUDE.md). Keeping every
  value (and the path it belongs at) in one **"AIOS secrets"** note makes this a
  copy-each-block-to-its-destination job.
- **Match the other machines.** `devices.md` (tracked) is the roster of what
  each machine runs — read it to know the target set of tools and connections
  for this one. Record this machine's local detail in its own gitignored
  `local-setup.md` as you go. (On the *second* machine ever, `devices.md` won't
  exist yet — create it and back-fill the first machine.)
- **Interactive vs. automatable.** Browser logins and OS installers that prompt
  are run by the **user** in their own terminal; installs, file placement, and
  verification reads the agent runs itself. Mark which is which as you go.
- **Platform differences.** Installers and machine-local bridges vary by OS —
  Windows uses its installers and directory **junctions**, macOS/Linux use their
  package managers and **symlinks**. Note the host OS and adapt; flag anything
  that doesn't port cleanly rather than assuming it works.

---

## Phase 0 — Bare-metal bootstrap  *(human, before this skill can run)*

The minimum to get the agent CLI running inside the cloned repo. If you (the
agent) are reading this from inside the repo, it's already done — skim and move
to Phase 1.

1. **git** — install it for the OS.
2. **The agent's runtime** — whatever the agent CLI needs (e.g. Node.js LTS for
   Claude Code or Codex).
3. **The agent CLI** — install it and log in once (e.g.
   `npm install -g @anthropic-ai/claude-code`, then run it).
4. **Repo access to clone** — the host CLI/credentials that can read the private
   AIOS repo (e.g. `gh auth login`).
5. **Clone the repo** to a standard location.
6. **Launch the agent in the repo** and invoke `/set-up-new-computer`. The rest
   is below.

---

## Phase 1 — Machine-local plumbing  *(only if your AIOS uses any)*

Some AIOS setups bridge an agent-expected path to a tracked repo folder with a
machine-local **junction (Windows) or symlink (macOS/Linux)** — for example,
pointing the agent's memory or skills directory at a repo folder so it syncs
across machines. These bridges are machine-local and must be recreated per
machine; a starter AIOS may have none.

If yours does, recreate them now and confirm the bridged paths resolve. A
`SessionStart` hook often recreates them automatically — verify rather than
assume. If the AIOS has none of this, skip the phase.

---

## Phase 2 — Toolchain  *(agent runs installs; user runs any that prompt)*

Install what `devices.md` shows the other machines running, matched to what this
machine will actually do — language runtimes, the service CLIs (e.g. the Google
Workspace CLI, a hosting CLI), and any tools whose setup lives in `guidance/`.
`git` and the agent runtime are already in from Phase 0. Record each install in
this machine's `local-setup.md` as you go.

---

## Phase 3 — Secrets and connections  *(mostly user; agent places files + verifies)*

### The secrets, and where each goes

Keep all secrets in **one** place in the password manager — an **"AIOS secrets"**
note whose body holds every value as plain text *plus the path each one belongs
at*, so restoring is "copy each block to its destination." A typical set:

- the Slack user token (`xoxp-…`) → root `.env`
- each service's OAuth client (e.g. `client_secret.json`) → its on-disk location
  (e.g. `~/.config/<service>/`)
- any per-project API keys → that project's own gitignored env file

You do **not** restore from the note anything a browser login re-mints on this
machine — refresh tokens, GitHub auth, hosting auth. Create the root `.env`
(gitignored) and place credential files from the note; the rest follow per
connection below.

### Bring up each connection

`connections/` and the matching `guidance/set-up-*.md` files are the live list —
follow them; don't trust this skill's examples to stay current. Each connection
reuses its cloud-side identity:

- **Google Workspace** — same OAuth client, new machine: place
  `client_secret.json`, then the user re-mints a refresh token with a browser
  login; you clear the token cache and verify. This is the *Adding another
  person* path in
  [`guidance/set-up-google-workspace.md`](../../../guidance/set-up-google-workspace.md)
  (same person, new device — same procedure).
- **Slack** — the user token from `.env` *is* the connection; no new app.
  Verify per [`guidance/set-up-slack.md`](../../../guidance/set-up-slack.md).
- **GitHub** — `gh auth login` per account.
- **Hosting, database, anything else** — follow each one's note in
  `connections/`.

---

## Phase 4 — Register the machine

1. **`local-setup.md`** (gitignored) — create it for this machine: specs,
   installed CLIs, local auth state, repo location. Use an existing machine's
   file as the template.
2. **`devices.md`** (tracked) — add a section for this machine: name, OS, specs,
   role, connections live, key tooling, status. **Overview only — no secrets or
   credential paths.** If this is the second machine and `devices.md` doesn't
   exist, create it and back-fill the first machine too.
3. **Commit and push** `devices.md` so the other machines learn about this one.
   Leave `local-setup.md` uncommitted — it's gitignored.

---

## Phase 5 — Verify end-to-end  *(agent runs these)*

Run each connection's own verification — the `auth status` plus a real read for
each CLI, the Slack `auth.test`, and so on. Confirm any machine-local plumbing
from Phase 1 resolves. If all pass, the machine is at parity — report what's
live and anything that needs the user's follow-up.

## Notes

- This skill **orchestrates**; the per-connection guidance files are the source
  of truth for their own steps. Link, don't duplicate.
- The connections named above (Google Workspace, Slack, GitHub) are just the
  common starting set. Real machines will have more — let `devices.md` and
  `connections/` drive the actual list, not this skill's examples.
- Commit and push as one coherent unit per
  [`guidance/git-practices.md`](../../../guidance/git-practices.md). Commit
  message: `Set up AIOS on <machine name>`.
