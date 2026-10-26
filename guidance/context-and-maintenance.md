# Context and maintenance

An AIOS works best when every session receives only the context it is likely to
need. More context is not free: it consumes tokens, dilutes priorities, and
makes important instructions easier to miss.

## Context stack

Keep information at the narrowest useful layer:

1. **Always-loaded kernel** — only universal operating rules in `AGENTS.md`.
2. **Ambient memory** — only durable facts that should shape unrelated sessions.
3. **Routing metadata** — short skill descriptions and optional project
   declarations.
4. **Selected context** — an advisor/persona or a project landing page.
5. **On-demand detail** — skill bodies, project documents, task folders, and
   references read only when relevant.

Moving detail out of the kernel is not deleting it. Give it a durable home and
leave a short route to that home.

## Admission tests

Before adding a rule to `AGENTS.md`, ask: must this affect almost every task, and
would omission create frequent or serious harm? If not, put it in guidance or a
project/skill document.

Before adding ambient memory, ask: should this fact influence a session even
when its originating project is not being worked on? If not, keep it with the
project. Prefer roughly 10–15 sharp memories to a running history; this is a
review trigger, not a hard cap.

Before creating a skill, ask whether the procedure has repeated or is clearly
repeatable. Keep its description to one sentence that distinguishes when to
invoke it; put steps in the body.

## Landing pages

A project or major area README should answer only:

- what this area is;
- its current state;
- where active work lives;
- where code or data lives;
- which deeper documents matter.

Do not turn the landing page into a second history. Old decisions can remain in
dated task records or a linked history document.

## Skill routing across Claude and Codex

Natural-language invocation is the default. A rare skill that causes unwanted
implicit triggering can be made explicit-only, but both providers must be
configured:

- Claude skill frontmatter: `disable-model-invocation: true`
- Codex `agents/openai.yaml`: `policy.allow_implicit_invocation: false`

Using only one control produces inconsistent behavior. A `project: <id>`
frontmatter field may route a Run-launched skill or persona to a fixed project
when nearly every legitimate use belongs there. Leave generic skills unbound.

## Maintenance rhythm

- Run `/dream` when the memory store needs reconciliation, relocation, or
  pruning.
- Run `/clean-up-aios` periodically or after a period of rapid growth to audit
  the whole context stack, routing, landing pages, stale mechanisms, and links.

`/clean-up-aios` is approval-gated: inspect, write a durable audit, grill only
the meaningful forks, write the implementation plan, and stop for explicit
approval before any edit. Verification must distinguish behavior actually
tested from static configuration and manual checks.

Useful advisory review triggers include kernel word count, ambient-memory count,
skill-description length, project landing-page freshness, broken links, and
legacy references. They prompt judgment; they are not automated quotas.
