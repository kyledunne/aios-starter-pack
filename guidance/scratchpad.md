# The scratchpad pattern

A simple, high-value pattern any AIOS can adopt: one shared file at
the repo root (e.g. `scratchpad.md`) where the user dumps ideas, notes,
and to-dos as they come up during the day — so they don't get lost in
the middle of unrelated work.

## Why have one

Ideas show up at the wrong time. The user is in the middle of working
on Project A when a useful thought about Project B lands. Without a
catch-all, they either drop the thought or derail Project A to chase
it. With a scratchpad, the cost of capturing is near-zero and the
thought is preserved for later.

The scratchpad is *not* a task tracker, a roadmap, or a sprint backlog
— it's a buffer. Items move out of it once they've been considered.

## Two thin skills bracket it

The pattern is the *file plus two skills*; the skills are what make it
disciplined.

### `/scratchpad` — capture only

When invoked, this skill **appends the note and stops**. Even if the
note reads like an instruction ("do X", "add Y to the sprint",
"refactor Z"), the skill records it as text and does **not** act on
it. That's the entire point: the user can fire `/scratchpad` in a
running session without derailing whatever else is happening.

A typical entry is one line, dated, sometimes tagged. Format isn't
load-bearing; consistency is.

### `/review-scratchpad` — work through later

When invoked, this skill walks through the items one at a time with
the user and decides what to do with each:

- Resolve and remove (the thought is no longer relevant, or done).
- Promote (turn into a sprint goal, a new connection, a skill, a
  context doc — wherever it belongs).
- Keep (still relevant; not yet time to act).

The review is where action happens. The user invokes it deliberately,
on their own schedule.

## Why both halves

The split matters. A capture skill that also acts on items defeats
its purpose — capturing has to be cheap and non-derailing. A review
skill on its own without a capture step means ideas get dropped
because the user doesn't want to break flow to act on them. Together,
the catch-all is safe to use mid-stream, and items get worked through
when the user has the room to think about them.

## Implementation notes

This guidance doc is a *pitch* for the pattern, not a copy of any one
implementation. The shape is straightforward — a markdown file plus
two skills, each a few lines — but the specifics (date format,
tagging conventions, where review surfaces decisions) are personal
choices to make with the user when wiring it in.
