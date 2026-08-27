#!/usr/bin/env node
// Ensure both `.claude/skills/` and `.agents/skills/` are LINKS into the repo's
// top-level `skills/` folder (the canonical source of truth).
//
// Cross-platform: one script for Windows, Linux, and macOS. Node's
// fs.symlinkSync(target, path, 'junction') makes a **directory junction** on
// Windows (no admin needed) and a plain **symlink** on Linux/macOS. This
// replaces the old per-OS pair (ensure-skills-junction.ps1 + .sh).
//
// The AIOS keeps skills at top-level `skills/` for visibility; Claude Code
// discovers them at `.claude/skills/` and OpenAI Codex CLI at `.agents/skills/`.
// Both are bridged here. The links are machine-local and git-ignored.
//
// Runs as a SessionStart hook (Claude Code and Codex). Idempotent and
// conservative: only acts when unambiguously safe. A real directory with files
// at either link path is left untouched and reported. Always exits 0.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const isWin = process.platform === 'win32';

function note(msg) {
  process.stdout.write(`[skills-link] ${msg}\n`);
}

function readStdin() {
  if (process.stdin.isTTY) return '';
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

function realOrNull(p) {
  try { return fs.realpathSync(p); } catch { return null; }
}

function samePath(a, b) {
  if (!a || !b) return false;
  const na = path.resolve(a);
  const nb = path.resolve(b);
  return isWin ? na.toLowerCase() === nb.toLowerCase() : na === nb;
}

function linkValue(p) {
  try { return fs.readlinkSync(p); } catch { return null; }
}

function safeReaddir(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

function gitRepoRoot(cwd) {
  try {
    const out = execFileSync('git', ['-C', cwd, 'worktree', 'list', '--porcelain'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const line = out.split(/\r?\n/).find((l) => l.startsWith('worktree '));
    if (line) return line.slice('worktree '.length).trim();
  } catch { /* fall through */ }
  try {
    return execFileSync('git', ['-C', cwd, 'rev-parse', '--show-toplevel'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
}

function ensureLink(source, target) {
  const existing = linkValue(source);
  if (existing !== null) {
    const current = realOrNull(source);
    if (samePath(current, realOrNull(target) || target)) return; // correct — stay silent
    note(`WARNING: '${source}' links to '${current || existing}', not '${target}'. Left unchanged.`);
    return;
  }

  if (fs.existsSync(source)) {
    if (safeReaddir(source).length > 0) {
      note(`WARNING: '${source}' exists as a real directory with files. Left unchanged.`);
      return;
    }
    fs.rmSync(source, { recursive: true, force: true });
  } else {
    fs.mkdirSync(path.dirname(source), { recursive: true });
  }

  // 'junction' => directory junction on Windows (absolute target required),
  // ignored on Linux/macOS where a normal symlink is made.
  fs.symlinkSync(target, source, 'junction');
  note(`Created the skills link: ${source} -> ${target}`);
}

function main() {
  let cwd = process.cwd();
  const raw = readStdin();
  if (raw && raw.trim()) {
    try {
      const hook = JSON.parse(raw);
      if (hook.cwd) cwd = hook.cwd;
    } catch { /* ignore */ }
  }

  // Resolve to the MAIN worktree so every worktree shares one source of truth.
  const repoRoot = gitRepoRoot(cwd);
  if (!repoRoot) return;

  const target = path.join(repoRoot, 'skills');
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    note(`Canonical skills folder is missing: ${target}. Skipped.`);
    return;
  }

  ensureLink(path.join(repoRoot, '.claude', 'skills'), target);
  ensureLink(path.join(repoRoot, '.agents', 'skills'), target);
}

try { main(); } catch (e) {
  note(`Skipped due to an error: ${e && e.message ? e.message : e}`);
}
process.exit(0);
