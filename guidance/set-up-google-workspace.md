# Set up Google Workspace access (`gws` CLI)

Connects an AIOS to **Gmail, Drive, Sheets, Calendar, and Docs** for one
Google account using the [Google Workspace CLI](https://github.com/googleworkspace/cli)
(`gws`). CLI is the deliberate choice over an MCP server or a raw API —
see the *Connections* section of the AIOS's `AGENTS.md` (CLI > API > MCP).

## Read this first

- **`gws` is pre-1.0.** It works well but has rough edges. The
  *Troubleshooting* section below covers every one hit so far — consult
  it the moment something looks off, rather than improvising.
- **One account per setup.** Multi-account support is buggy pre-1.0, so
  set up a single account and stop. A second account is a separate
  problem to revisit when `gws` matures.
- **Interactive vs. automatable.** `gws auth setup` and `gws auth login`
  are interactive (terminal prompts plus browser pop-ups). An agent
  cannot drive them — the **user runs those in their own terminal**
  while the agent guides. Installs, status checks, verification reads,
  and cache clears, the agent runs itself.

## Which path

- **Full setup** — first AIOS in an organisation, no shared OAuth client
  exists yet. Do the whole procedure.
- **Additional person** — joining an organisation that already has a
  working `gws` OAuth client. Skip most of this; jump to *Adding another
  person* near the end.

---

## Full setup

### Step 1 — Install `gws`  *(agent runs this)*

Requires Node.js (`node --version` to check). Then:

```
npm install -g @googleworkspace/cli
```

Confirm with `gws --version`.

### Step 2 — Install `gcloud`  *(agent runs this)*

`gws auth setup` needs the Google Cloud CLI. On Windows:

```
winget install --id Google.CloudSDK --exact --silent --accept-package-agreements --accept-source-agreements
```

On macOS / Linux, use the installer from
<https://cloud.google.com/sdk/docs/install>.

**Gotcha:** a freshly installed `gcloud` is not on `PATH` in any
terminal that was already open. Have the user open a **new** terminal,
or on Windows refresh `PATH` from the registry in PowerShell:

```
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
```

Verify with `gcloud --version`.

### Step 3 — Run `gws auth setup`  *(user runs this)*

Interactive; opens a browser. The user opens a **new** terminal (so
`gcloud` is on `PATH`) and runs:

```
gws auth setup
```

Five-step wizard:

1. **Finds the gcloud CLI** — automatic.
2. **Authenticate** — browser opens. Must sign in as **the account
   being connected**. If the browser is logged into several Google
   accounts, watch the account picker carefully.
3. **Select the GCP project** — choose **Create a new project**. Don't
   reuse an unrelated existing project. Pick a clear dedicated name
   (e.g. `<org>-aios-cli`). The project is created under the work
   account's organisation, which is what later allows an `Internal`
   consent screen.
4. **Select APIs to enable** — pick **Gmail, Drive, Sheets, Calendar,
   Docs** (five). Enabling an API is free and harmless; it only lets the
   project *call* the service. Actual access is governed by OAuth
   scopes in Step 5. (If one's missed, enable it later in one click at
   <https://console.cloud.google.com/apis/library> — no wizard re-run
   needed.)
5. **Enter OAuth Client ID** — wizard pauses. The OAuth client does not
   exist yet; create it in Step 4 below, then paste it back.

### Step 4 — Create the OAuth client in the Cloud Console  *(user does this in a browser)*

`gws` ships no OAuth credentials of its own; every first-time setup
creates one. Leave the `gws auth setup` prompt waiting; do this in the
browser, signed in as the connecting account with the new project
selected in the top project picker.

**4a. Configure the consent screen** at
<https://console.cloud.google.com/auth/overview> ("Google Auth
Platform"):

- **App Information** — name the app for the *application* (e.g. `Acme
  AIOS`), not the person. Multiple people may authenticate against one
  app; a personal name would show up on a teammate's consent screen.
- **Audience — choose `Internal`.** Critical. The gws docs say
  "External, testing mode is fine"; that's only true for personal
  `@gmail.com` accounts. External + testing apps issue refresh tokens
  that **expire after 7 days**, forcing a re-login every week.
  `Internal` apps (available because the project is in a Workspace
  organisation) never expire, need no test-user list, and need no
  Google verification. If `Internal` is greyed out, the project is not
  in a Workspace org, or org policy forbids it — stop and resolve that
  before continuing.
- **Contact Information** — developer contact email = the work account.
- **Finish** — accept the Google API Services User Data Policy.

**4b. Create the OAuth client** at
<https://console.cloud.google.com/apis/credentials> → **Create
credentials → OAuth client ID**.

- **Application type — `Desktop app`.** Mandatory. Any other type
  causes `redirect_uri_mismatch` and login fails. Name it anything.

**4c.** Dialog shows a **Client ID** and **Client Secret**. Back in the
terminal, paste the Client ID at the `gws auth setup` prompt; it then
asks for the Client Secret. `gws auth setup` finishes — but the token
it has stored so far carries only setup/identity scopes, **not** data
scopes. Step 5 fixes that.

### Step 5 — Authenticate with the right scopes  *(user runs this)*

**The step most likely to go wrong.** Have the user run:

```
gws auth login --scopes https://www.googleapis.com/auth/gmail.modify,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/documents
```

This is the AIOS standard: full read/write for Drive, Sheets, Calendar,
and Docs, plus Gmail `modify` (everything but permanent delete — see
*Scopes reference*). For a tighter least-privilege grant, swap in the
`.readonly` variants (`drive.readonly`, `calendar.readonly`,
`documents.readonly`) and drop `spreadsheets`.

Use **`--scopes` with full scope URLs**. Do **not** use `-s` /
`--services` — that flag only filters an interactive scope picker, and
the picker's recommended preset ("core consumer scopes") grants only
OpenID identity scopes, no Gmail/Drive access at all. `--scopes`
bypasses the picker.

Browser opens; user approves, signed in as the work account. The
consent screen should list Gmail, Drive, Sheets, Calendar, and Docs.

### Step 6 — Clear the stale token cache  *(agent runs this)*

`gws auth login` updates stored credentials but does **not** invalidate
its access-token cache. Reads can still fail with `403 insufficient
scopes` right after a correct login. Delete the cache so `gws` mints a
fresh token from the new grant:

```
# Windows / PowerShell
Remove-Item ~/.config/gws/token_cache.json -Force

# macOS / Linux
rm -f ~/.config/gws/token_cache.json
```

### Step 7 — Verify  *(agent runs this)*

```
gws auth status        # 'user' is correct; 'scopes' lists gmail.* and drive.*
gws gmail +triage      # unread inbox summary
gws drive files list --format table
```

If all three succeed, setup is done.

---

## Adding another person (existing OAuth client)

When an organisation already has a working `gws` setup, a new person
does **not** repeat Steps 2–4. One Internal OAuth client serves the
whole org — each person authenticates as themselves against it.

1. Install `gws` (Step 1). `gcloud` is **not** needed.
2. Obtain the existing `client_secret.json` from whoever did the first
   setup (`~/.config/gws/` on their machine). Place it at
   `~/.config/gws/client_secret.json` on the new machine.
3. Run Step 5 (`gws auth login --scopes ...`), signing in as the new
   person's account.
4. Do Step 6 (clear token cache) and Step 7 (verify).

---

## Scopes reference

The AIOS standard — full read/write where it makes sense:

| Scope | Grants |
|---|---|
| `gmail.modify` | Read, send, and organise mail (label, archive, mark read, **move to Trash**). Excludes only *permanent* delete — see below. |
| `drive` | Full read/write — list, read, upload, edit, delete all Drive files. |
| `spreadsheets` | Full read/write of Google Sheets. |
| `calendar` | Full read/write — read, create, edit, delete events. |
| `documents` | Full read/write of Google Docs content. |

Tighter least-privilege alternatives, if a connection should stay
read-only: `drive.readonly`, `calendar.readonly`, `documents.readonly`
(and omit `spreadsheets`). `gmail.readonly` exists too, but
`gmail.modify` is the practical default since the AIOS sends and triages
mail.

**On deleting email.** `gmail.modify` *can* move messages to **Trash**
(reversible; Gmail auto-purges Trash after ~30 days), which covers
ordinary inbox cleanup — bulk-trashing old mail works fine. What it
can't do is `messages.delete`: immediate, permanent deletion that
bypasses Trash. That requires the full `https://mail.google.com/` scope.
Leaving it off is a deliberate safety margin — the AIOS can't
irreversibly destroy mail. Once the user trusts the AIOS, upgrade by
re-running Step 5 with `https://mail.google.com/` in place of
`gmail.modify` (a superset), then redo Step 6.

**Deleting safely, the other services.** Gmail is the *only* service
whose scopes distinguish "everything except permanent delete" from full
access. Drive, Sheets, Docs, and Calendar have no such scope — full
read/write includes permanent delete. So make it a **behavioral
default** instead: always move to Trash, never permanently delete,
unless the user asks. Trash is recoverable for ~30 days everywhere.
Drive files (and Sheets/Docs, which are Drive files) trash via
`drive files update` with `{"trashed":true}` rather than the permanent
`drive files delete`; deleted Calendar events go to a 30-day Bin; and
edits *inside* a Doc/Sheet are caught by automatic version history
(`drive revisions list`). The stronger version of this guarantee is a
thin wrapper CLI that only exposes the trash path — worth it once an
AIOS runs unattended, overkill before then.

To change any scope later (either direction), re-run Step 5 with the
desired scope URLs, then redo Step 6 (clear the token cache) — the new
grant won't take effect until the stale cache is gone. If a *new*
service is involved, also enable its API (Step 3.4 or the API library).

## Troubleshooting

- **`403` / `insufficient authentication scopes`** on every read — two
  causes; check both. (a) Login used `-s` / `--services` and the picker
  granted identity-only scopes — redo Step 5 with `--scopes`. (b) Stale
  token cache — redo Step 6. Confirm granted scopes any time with `gws
  auth status`.
- **`redirect_uri_mismatch`** during login — OAuth client wasn't
  created as **Desktop app** type. Recreate it (Step 4b).
- **`Internal` not selectable** on the consent screen — project is not
  in a Workspace organisation, or org policy forbids Internal apps.
  Resolve with the user; falling back to External + testing means a
  forced re-login every 7 days.
- **`gcloud` "not recognised"** right after install — `PATH` is stale;
  open a new terminal or refresh `PATH` (Step 2).
- **An interactive command appears to hang** when the agent runs it —
  `gws auth setup` / `gws auth login` can't be driven by an agent. Hand
  them to the user.
- **Re-login needed every week** — consent screen is External + testing.
  Switch the app to `Internal` (Step 4a).

## Notes

- Credentials live in `~/.config/gws/` (`client_secret.json`,
  `credentials.enc`, `token_cache.json`) — **outside** the AIOS repo.
  Never commit them.
- `gws` is pre-1.0; its command surface may shift between versions. If
  a command here no longer matches, check `gws <command> --help`.
