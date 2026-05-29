# The Karpathy wiki pattern (`raw/` / `wiki/` / `outputs/`)

A folder pattern, popularised by Andrej Karpathy in April 2026, for
turning a pile of messy source material into a structured LLM-maintained
knowledge base and using that base to answer specific questions.

Useful whenever an AIOS user wants to analyse a real corpus — financial
exports, research material, personal documents, a project archive — not
just chat about it once. The three-folder split is what makes the
pattern work over time: the raw layer stays trustworthy because nothing
edits it, the wiki layer stays coherent because only the LLM writes to
it under a consistent schema, and outputs stay auditable because each
one is a discrete artifact you can re-derive.

```
<topic>/
├── raw/      # immutable source material — append-only
├── wiki/     # LLM-maintained structured knowledge base
└── outputs/  # specific answers, reports, recommendations
```

## The three layers

### `raw/` — append-only source of truth

The user drops in original materials: CSVs, PDFs, screenshots, emails,
meeting notes, articles, anything. **Never edit files here.** Never
rewrite, reformat, or "clean up" raw files. If a file is wrong, add a
corrected version alongside it rather than overwriting — `raw/` is the
audit trail for everything the wiki has ever read.

Naming convention: prefix with an ISO date when the content is
time-bound (`transactions-2026-05-23.csv`, `bank-statement-2026-04.pdf`)
so chronology is obvious from the filename alone.

### `wiki/` — LLM-maintained structured knowledge

The agent reads `raw/` and writes a structured, human-readable knowledge
base in Markdown. One file per concept, entity, or topic. Cross-link
liberally with `[[wiki-link]]` references — Obsidian's native link
syntax (see [Viewing the wiki in Obsidian](#viewing-the-wiki-in-obsidian)
below).

The wiki should always include:

- **`index.md`** — a content catalogue: every page listed with a
  one-line summary, organised by category. The map of the wiki.
- **`log.md`** — append-only chronological ledger of changes, one line
  each: `## [YYYY-MM-DD] action | title`. Lets the user (and the LLM)
  see what was ingested when.

The LLM owns this folder entirely. When new material lands in `raw/`,
the ingest step **updates every wiki page the new source touches**
(typically 10–15 pages for a substantive source) — it does not just
append.

### `outputs/` — specific answers and reports

When the user asks a concrete question ("which subscriptions am I
likely paying for but not using?", "what's the renewal calendar for the
next 90 days?"), the answer goes here as a dated Markdown file. Each
output is a persistent, re-readable artifact rather than a transient
chat response.

Naming convention: ISO date + a short slug, e.g.
`2026-05-25-subscription-cancellation-candidates.md`.

## Viewing the wiki in Obsidian

The `wiki/` layer is an interlinked set of Markdown files — exactly
what Obsidian is built to browse, and the way Karpathy uses the
pattern himself: the LLM agent open on one side, Obsidian on the
other. Point an Obsidian vault at the project (or just the `wiki/`
folder) and the `[[wiki-links]]` the agent writes become clickable
navigation plus a live backlink graph — Karpathy calls the graph view
"the best way to see the shape of your wiki — what's connected to
what." The Dataview plugin can also query page frontmatter for ad-hoc
views.

This is why the wiki uses `[[...]]` links rather than Markdown path
links: `[[...]]` is Obsidian's native syntax. (Karpathy leaves schema
and tooling to the user's preference rather than mandating a link
format — but since he recommends Obsidian as the viewer, its native
wikilinks are the natural default.)

## Workflows

### Bootstrapping a new project

1. Create the three folders inside the project folder: `raw/`, `wiki/`,
   `outputs/`.
2. Place any starting source files in `raw/`. Leave `wiki/` and
   `outputs/` empty until the user asks for an ingest or a query.
3. Add an empty `.gitkeep` to `wiki/` and `outputs/` so the folder
   structure is preserved in version control before there is any real
   content.
4. Do **not** auto-generate the wiki at this stage. The first ingest
   happens when the user explicitly asks for it — they may want to add
   more raw files first, or scope the wiki in a particular direction.

### Ingest — building or updating the wiki

When the user says "build the wiki" or "ingest the new files":

1. **List what is in `raw/`** and what is already in `wiki/`. Decide
   which raw files are new or changed and which wiki pages they touch.
2. **Plan before writing.** For each new/changed raw source, identify
   the entities and concepts it introduces, and the existing wiki pages
   that need updates. Share the plan with the user if the scope is
   non-trivial.
3. **Write wiki pages** as plain Markdown, one concept per file. Use
   `[[wiki-links]]` to connect related pages. Each page should stand on
   its own — a reader (human or LLM) should understand it without
   reading the raw source.
4. **Update `index.md`** with one-line summaries of every page, grouped
   by category.
5. **Append to `log.md`**:
   `## [YYYY-MM-DD] ingest | <one-line summary of what was added or revised>`.

### Query — producing an output

When the user asks a specific question of the corpus:

1. Read `wiki/index.md` first, then drill into the relevant pages. Only
   fall back to `raw/` if the wiki lacks the detail needed.
2. Write the answer as a single dated Markdown file in `outputs/`.
   Include: a brief restatement of the question, the answer with
   supporting reasoning, and inline references to the wiki pages (and
   raw sources, if applicable) the answer was derived from.
3. Append to `log.md`:
   `## [YYYY-MM-DD] output | <question slug>`.

### Lint — periodic maintenance

When the user asks for a wiki audit, scan for: contradictions between
pages, stale claims that newer raw sources have superseded, orphan
pages with no inbound links, missing cross-references, and obvious
gaps. **Report findings; do not silently rewrite.**

## When to reach for this pattern

- A user wants to start analysing a messy corpus (financial exports, a
  research topic, a set of personal documents) and explicitly
  references Karpathy / raw-wiki-outputs / the three-folder approach.
- An existing folder already has `raw/`, `wiki/`, `outputs/` subfolders
  and the user asks to ingest, query, or audit.
- The user wants to scaffold the structure for a new topic.

For a one-off question about a single file, the pattern is overkill.
Answer directly.

## Source

Andrej Karpathy, [llm-wiki GitHub
gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f),
published April 2026.
