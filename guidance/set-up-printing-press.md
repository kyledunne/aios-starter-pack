# Set up Printing Press (mint agent-native CLIs)

[**Printing Press**](https://printingpress.dev/) is a generator that
turns any service into an agent-native CLI. Feed it an API spec, a
GraphQL schema, a HAR capture of browser actions, or even a website
with no public API, and it emits a Go CLI binary — plus a Claude Code
skill, an OpenClaw skill, and an MCP server, all wrapping the same
surface.

By [Matt Van Horn](https://github.com/mvanhorn) and Trevin Chow.
Featured by [Nate Herk on 2026-05-09](https://youtu.be/YHk45NEpspE).

## Why this matters for an AIOS

The standing connection preference is **CLIs over APIs over MCP
servers** (see `CLAUDE.md`). When a service the user wants to wire in
has no first-party CLI (or only a weak one), Printing Press is the way
to mint one. Pitch: ~35× fewer tokens than the equivalent MCP server
because the agent runs `tool subcommand --flag` and reads stdout, with
no JSON-RPC overhead and no tool schemas sitting in context every
turn.

## The two parts

Printing Press ships as two tools:

- **The generator** — `cli-printing-press`, a Go binary. Used to mint
  a new CLI from scratch.
- **The library** — `@mvanhorn/printing-press-library`, an npm package
  exposing 150+ pre-built CLIs across 17 categories (Travel, Commerce,
  Media, Productivity, …). Install one with a single command; no spec
  or generation needed.

Most of the time, **check the library first** — if someone has already
generated a CLI for the service in question, grab it. Only fall back
to generation when nothing in the library fits.

## Prereqs

- **Node** — for the library (which runs via `npx`).
- **Go** — for the generator and for the Go binaries it produces.

Install Go from <https://go.dev/dl/> or via package manager (e.g.
`winget install GoLang.Go`, `brew install go`).

## Install

### Library (one-off, per CLI)

```sh
npx -y @mvanhorn/printing-press-library list                # browse
npx -y @mvanhorn/printing-press-library install <name>      # install one
```

### Generator

```sh
go install github.com/mvanhorn/cli-printing-press/v4/cmd/cli-printing-press@latest
```

## Workflow — generating a new CLI

1. **Check the library first** with the `list` command above.
2. If nothing fits, invoke `cli-printing-press` (or its bundled
   Claude Code skill if installed) and walk through: identify the API
   surface (spec / schema / HAR / crawl), generate the Go CLI, install
   it, and document the resulting commands inside the AIOS.
3. The generated CLI becomes its own AIOS connection (if it
   authenticates as the user and accesses their data) or tool (if it's
   a general-purpose capability). Record it in the relevant folder so
   the knowledge compounds.

## Sources

- [Printing Press homepage](https://printingpress.dev/)
- [Nate Herk video — 2026-05-09](https://youtu.be/YHk45NEpspE)
- [DeepWiki: mvanhorn/cli-printing-press](https://deepwiki.com/mvanhorn/cli-printing-press)
