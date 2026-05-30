---
name: get-connected
description: Walk a new AIOS user through their first two connections — Google Workspace (Gmail / Drive / Calendar / Docs) and Slack. Use as the natural next step after `/onboarding`, when the Context layer exists and the user is ready to wire the AIOS into the services they actually use day-to-day.
---

# Get connected — first two connections

This skill is the user's introduction to **Layer 2 — Extensions** (see
[`CLAUDE.md`](../../../CLAUDE.md)). It walks them through two
connections to start: **Google Workspace** and **Slack**. Both are
high-leverage — they cover most people's daily communication and
calendar surface — and the setup procedures are already documented in
detail, so this skill is mostly orchestration.

## Before you start

- Confirm `/onboarding` has been run (there should be an
  `about-<name>/` folder). If not, point the user there first — the
  context layer should exist before the connections layer.
- Tell the user roughly what to expect: two connections, 20–40 minutes
  total depending on whether they hit OAuth approval waits, and most
  of the clicking happens in their browser while you guide them.

## Connection 1 — Google Workspace

Connects Gmail, Drive, Sheets, Calendar, and Docs via the `gws` CLI. Follow
[`guidance/set-up-google-workspace.md`](../../../guidance/set-up-google-workspace.md)
end to end — it covers install, OAuth client creation, scopes, the
stale-token-cache gotcha, and verification.

Two things to flag explicitly to the user as you start:

- **Some steps are interactive** (`gws auth setup`, `gws auth login`)
  — they open a browser and require the user to click through. You'll
  hand those off; you'll handle the installs and verification reads
  yourself.
- **The `Internal` vs `External` consent-screen choice matters.**
  Picking `External + testing` means a forced re-login every 7 days.
  Pick `Internal` if the project is in a Workspace organisation (it
  almost always is for a work account). The guidance file calls this
  out — don't skip past it.

When verification passes (`gws auth status`, `gws gmail +triage`, `gws
drive files list`), the connection is live. Make a brief note in the
AIOS — a one-paragraph `connections/google-workspace.md` recording
which account is connected and pointing at the guidance file for
re-setup — so the knowledge compounds rather than being relearned next
time.

## Connection 2 — Slack

Creates a custom Slack app in the user's workspace with a User OAuth
Token, then stores the token in the AIOS root `.env`. Follow
[`guidance/set-up-slack.md`](../../../guidance/set-up-slack.md) end to
end.

Things to flag explicitly:

- **User token, not bot token.** Bot tokens can't read DMs, can't see
  channels the bot isn't invited to, and can't search at all. The
  guidance file is clear about this — keep the 16 scopes under **User
  Token Scopes**, leave Bot Token Scopes empty.
- **Admin approval may be required.** If the user's workspace doesn't
  allow member-installed apps, an admin has to approve before the
  token appears. That's a wait, not a failure — set expectations.

When verification passes (`auth.test` returns `ok: true`, all 16
scopes present), the connection is live. Note it in
`connections/slack.md` the same way as Google.

## After both connections

A short wrap-up to the user:

> "You now have your first two connections live. From here, every
> connection follows the same shape — find the guidance for it (or
> ask me to figure it out), authenticate, verify, leave a one-pager
> in `connections/` so future-you and future-AIOSes know it's there."

Mention what's commonly next (varies by user): GitHub if they code,
Netlify or similar if they ship websites, calendar-specific tools if
their calendar work is heavy. Don't push — they'll know when they
hit a task that needs a new connection.

Now that this machine has real tooling and connections, **seed
`devices.md`** at the repo root (create the file — this is the first
machine). Add one short, non-sensitive section: the machine's name, OS,
specs, and the connections now live. `devices.md` is the tracked roster
a *future* machine reads to reach parity, so it's worth starting from
this first machine rather than waiting for a second — the gitignored
`local-setup.md` can't serve that purpose because it never leaves this
machine. Keep `devices.md` to the overview; machine-specific or
sensitive detail belongs in `local-setup.md`. (See
[`CLAUDE.md` → Tracking machines and local setup](../../../CLAUDE.md).)

Commit and push as one coherent unit per
[`guidance/git-practices.md`](../../../guidance/git-practices.md).
Commit message: `Connect Google Workspace and Slack; seed devices.md`.

## What this skill doesn't cover

- **Other connections.** Just Google Workspace and Slack. Other
  services — GitHub, Netlify, Supabase, calendar tools, whatever the
  user lives in — get set up as the need arises, following the same
  pattern. The `guidance/` folder will grow over time; check it (and
  the upstream repo via
  [`guidance/more-guidance-online.md`](../../../guidance/more-guidance-online.md))
  before improvising.
- **Tools and references.** Connections grant access to the user's
  data; tools and references are different layers. See
  [`CLAUDE.md`](../../../CLAUDE.md).
- **Day-to-day usage.** Once a connection is live, using it (sending
  email, searching Slack, reading Drive) is just calling the CLI or
  API directly. This skill is setup only.
