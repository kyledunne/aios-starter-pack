---
name: clean-up-aios
description: Audit and streamline an AIOS when its context, routing, memories, skills, or structure need a deliberate cleanup.
---

# Clean Up AIOS

Run a conservative, evidence-led maintenance pass over the whole AIOS. The
skill may propose aggressive simplification, but it must never edit before the
user approves a written plan.

## 1. Inspect without editing

Read the root instructions, AIOS map, memory index, skill roster, project
declarations, folder landing pages, and local maintenance standards. Inspect the
actual repository before accepting a document's claims.

Measure at least:

- always-loaded instruction and memory size;
- memory-file count and index consistency;
- skill count, description quality, project routing, and explicit-only controls;
- declared projects whose landing page is absent, stale, or too large to route;
- duplicate guidance, legacy mechanisms, broken links, and stale references;
- current git state, nested repositories, and unrelated work to preserve.

Do not modify files during this phase.

## 2. Externalize the audit

Create a dedicated task folder under the appropriate `working/` and write the
findings to `audit.md`. Separate observations from recommendations. Record
baseline measurements and exact implicated paths so a fresh agent can resume.

## 3. Run a mini grill

Ask only judgment calls that would materially change the cleanup. Ask one
question at a time, recommend an answer, and checkpoint each answer before the
next. Derive mechanical details from the repository. Skip settled forks.

Typical forks include kernel size, ambient-memory admission, retirement versus
retention of legacy workflows, natural versus explicit-only skill invocation,
project boundaries, and what to defer.

## 4. Write the implementation plan

Turn the audit and decisions into an ordered plan naming:

- files and mechanisms to change;
- information to retain and its destination;
- removals and their pre-deletion checks;
- deliberate deferrals;
- verification for every supported agent or chat surface;
- repository boundaries and commit expectations.

Write the plan in the task folder. Then pause and request explicit approval.
**Do not edit any target file before approval**, even when the cleanup seems
routine.

## 5. Apply the approved plan

After approval, preserve unrelated changes and work in coherent change sets.
Before deleting anything, check for unique information and live references;
promote useful durable knowledge first. Prefer moving detail behind concise
entry points over losing it.

Keep ambient instructions distinct from on-demand documentation, memory from
project context, project identity from generic task procedures, current routing
from historical records, and portable conventions from personal details.

If the scope includes a Starter Pack or template, propagate the portable
architecture without copying private facts or personal taxonomy.

## 6. Verify

Re-run the baseline measurements. Check links, indexes, frontmatter, project
paths, skill discovery metadata, explicit-only controls, and git status in each
repository touched.

Where safely available, test fresh Claude and Codex sessions plus ordinary and
project-filed app chats. Distinguish behavior actually exercised from static
configuration and checks requiring manual app interaction.

## 7. Report

Update the task folder with changes, before/after measurements, verification,
limitations, and deferrals. Report concisely to the user.

`/dream` remains the narrower memory-only maintenance skill.
