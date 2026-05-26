# Set up Slack access (Web API + user token)

Connects an AIOS to a Slack workspace by creating a custom Slack app in
that workspace, granting it user-token scopes, and storing the resulting
User OAuth Token (`xoxp-…`) so the AIOS can call the Slack Web API
directly as the person.

The connection talks to `https://slack.com/api/<method>` over plain
HTTPS — no Slack CLI involved. The official `slack` CLI is geared
toward Slack-app *development* (manifests, run-on-slack hosting); for
read/send/search it's overkill.

## Read this first

- **User token, not bot token.** A personal AIOS acts as the person.
  Bot tokens (`xoxb-…`) can't read DMs, can't see channels they aren't
  invited to, and can't use `search.messages` at all. Always grant the
  scopes below as **User Token Scopes**, not Bot Token Scopes.
- **One app per AIOS per workspace.** Don't share apps across AIOSes —
  each person's AIOS gets its own app in any workspace it connects to,
  so identity stays clean.
- **Most steps happen in the user's browser.** Steps 1–4 are clicking
  through <https://api.slack.com/apps> and the workspace's Slack web
  UI. An agent cannot drive those — guide the user through them. Steps
  5–6 (paste the token, verify) the agent handles once the user is
  back.
- **Admin approval may be required.** If the user is not a workspace
  admin and the workspace requires admin approval for new app installs,
  Step 3 blocks until an admin approves. Not a failure mode; just a
  wait.

## Steps

### Step 1 — Create the Slack app  *(user does this in a browser)*

Go to <https://api.slack.com/apps> → **Create New App** → **From
scratch**.

- **App Name:** identify the AIOS, e.g. `<Name> AIOS`. Name it for the
  AIOS, not the workspace — the name shows up to workspace admins.
- **Pick a workspace:** the target workspace.
- Click **Create App**.

User lands on the app's settings page.

### Step 2 — Add User Token Scopes  *(user does this in the same browser tab)*

Left sidebar → **OAuth & Permissions** → scroll to **Scopes** → **User
Token Scopes** (the section below Bot Token Scopes; **leave Bot Token
Scopes empty**).

Add the following — a reasonable starting set covering the full
read/send/search surface, no admin or destructive operations:

**Read messages**

- `channels:history` `channels:read`
- `groups:history` `groups:read`
- `im:history` `im:read`
- `mpim:history` `mpim:read`

**Send and interact**

- `chat:write`
- `reactions:read` `reactions:write`
- `files:read` `files:write`

**Search and lookups**

- `search:read`
- `users:read`
- `team:read`

Sixteen scopes total. See *Scopes reference* below for what each one
unlocks, and *Deliberately omitted* for the ones we don't grant and
why.

### Step 3 — Install to workspace  *(user does this)*

Scroll to the top of OAuth & Permissions → **Install to Workspace** →
approve.

- Workspace **owner / admin** — install completes immediately.
- Regular member, workspace allows member installs — also completes
  immediately.
- Workspace requires **admin approval** — Slack routes the request to
  an admin. Wait for them to approve; the token appears on the OAuth &
  Permissions page once they do.

### Step 4 — Copy the User OAuth Token  *(user does this)*

Top of the OAuth & Permissions page → **User OAuth Token** (starts with
`xoxp-`). Click the copy button.

### Step 5 — Paste into the AIOS root `.env`  *(user does this)*

User pastes the token into the AIOS root `.env` file as:

```
SLACK_USER_TOKEN=xoxp-...
```

The root `.env` is gitignored. Create it if it doesn't exist. Other
AIOS-wide connection tokens belong in the same file.

### Step 6 — Verify  *(agent runs this)*

Call `auth.test` with the token to confirm it works and the granted
scopes are what was expected. With PowerShell:

```powershell
$token = ((Get-Content .env | Select-String '^SLACK_USER_TOKEN=').Line -replace '^SLACK_USER_TOKEN=', '').Trim()
$resp = Invoke-RestMethod -Uri 'https://slack.com/api/auth.test' `
    -Headers @{ Authorization = "Bearer $token" }
$resp | ConvertTo-Json
```

With curl:

```bash
TOKEN=$(grep '^SLACK_USER_TOKEN=' .env | cut -d= -f2-)
curl -s -H "Authorization: Bearer $TOKEN" https://slack.com/api/auth.test
```

Response should include `"ok": true` and the user's identity.

To check the actual granted scopes, the `auth.test` response headers
include `x-oauth-scopes` — pull that and confirm all sixteen are
present.

### Step 7 — Smoke-test a real call  *(agent runs this)*

Optional but reassuring. Send the user a self-DM end-to-end:

```powershell
$token = ((Get-Content .env | Select-String '^SLACK_USER_TOKEN=').Line -replace '^SLACK_USER_TOKEN=', '').Trim()
$userId = (Invoke-RestMethod -Uri 'https://slack.com/api/auth.test' `
    -Headers @{ Authorization = "Bearer $token" }).user_id
$body = @{ channel = $userId; text = 'Hello from your AIOS — Slack connection is live.' }
Invoke-RestMethod -Uri 'https://slack.com/api/chat.postMessage' `
    -Headers @{ Authorization = "Bearer $token" } -Method Post -Body $body
```

Ask the user to confirm the message appeared in their self-DM.

## Scopes reference

| Scope | Grants |
|---|---|
| `channels:history` / `channels:read` | Read messages from / list public channels the user is in |
| `groups:history` / `groups:read` | Same, for private channels the user is in |
| `im:history` / `im:read` | Read / list direct messages |
| `mpim:history` / `mpim:read` | Read / list group direct messages |
| `chat:write` | Send messages as the user, in any channel/DM the user is in |
| `reactions:read` / `reactions:write` | See and add emoji reactions |
| `files:read` / `files:write` | Read shared file attachments / upload files |
| `search:read` | Use `search.messages` and `search.files` — **user-token only**, bot tokens can't search at all |
| `users:read` | Look up user IDs, names, profiles |
| `team:read` | Workspace metadata |

### Deliberately omitted

- `chat:write.public` — post to channels the user isn't in. The user
  can always join a channel and then post; granting this widens the
  surface unnecessarily.
- `channels:write` / `channels:manage` / `groups:write` — create,
  rename, archive channels. An AIOS is for *using* Slack, not
  administering it.
- Anything under `admin.*` — workspace admin operations. Out of scope
  for a personal AIOS by design.

To broaden later, return to **OAuth & Permissions → User Token
Scopes**, add the new scope, then **Reinstall to Workspace**. The token
stays the same across reinstalls; no `.env` update needed. Re-run Step
6 to confirm.

## Troubleshooting

- **`invalid_auth`** from any API call — token in `.env` is wrong or
  rotated. Re-copy from the OAuth & Permissions page and re-paste.
- **`missing_scope`** from a specific API call — the scope that method
  needs wasn't granted. Error response includes the needed scope name;
  add it (User Token Scopes), reinstall, re-verify.
- **`not_authed`** — `Authorization: Bearer <token>` header is missing
  or malformed.
- **Install request stays pending** — workspace requires admin approval
  and no admin has acted. Ping them.
- **`Internal` / `External` / consent-screen confusion** — does **not**
  apply to Slack. That's Google's model. Slack apps live inside one
  workspace and need no consent-screen configuration.

## Notes

- The token lives in the AIOS root `.env` (gitignored). Never commit
  it.
- Day-to-day usage (sending, reading, searching) is plain HTTPS against
  the [Slack Web API](https://api.slack.com/methods) — every method
  documents the required scopes and parameters.
