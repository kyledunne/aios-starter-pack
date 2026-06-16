'use strict';

const vscode = require('vscode');

/**
 * AIOS Markdown Auto-Preview
 * --------------------------
 * Fixes the one annoyance that can't be solved with settings: the Claude Code
 * VS Code extension opens Markdown chat links as raw SOURCE, ignoring the
 * `workbench.editorAssociations` rule that says ".md should open as preview".
 *
 * This extension watches the editor tabs. When a Markdown file appears as a
 * *source* (text) editor that we did NOT expect, it closes it and reopens the
 * same file as the rendered preview editor (`vscode.markdown.preview.editor` —
 * the exact editor an editorAssociation would have used). Net effect: click a
 * link, it opens rendered. One click, no shortcuts, no menus. (Brief source
 * flash.)
 *
 * The hard part is letting "Reopen as source file" actually stick. We classify
 * each Markdown file by intent and REMEMBER that decision, because
 * `onDidChangeTabs` fires `changed` events for unrelated reasons (focus, dirty
 * state, group moves) and we must not re-swap on those:
 *   - A text editor for a file we did NOT just show as preview = a forced-source
 *     open (Claude link) -> swap it to preview.
 *   - A text editor for a file that WAS just preview = a deliberate downgrade
 *     ("Reopen as source file", or our own command) -> leave as source AND
 *     record it in `sourceTabs` so later change events don't bounce it back.
 *   - `sourceTabs` is cleared only when that text tab actually closes.
 */

const PREVIEW_VIEW_TYPE = 'vscode.markdown.preview.editor';
const TEXT_VIEW_TYPE = 'default'; // built-in plain text editor

let enabled = true;
let debug = false;
let channel = null;

// Files currently shown (or just swapped) as the rendered preview editor.
const previewed = new Set();
// Files we've decided to leave as SOURCE on purpose (downgrade / explicit
// command). Guards against spurious `changed` events re-triggering a swap.
// Cleared when the file's text tab closes.
const sourceTabs = new Set();
// Reentrancy guard so a swap-in-progress doesn't re-trigger itself.
const swapping = new Set();

function activate(context) {
  enabled = readConfig('enabled', true);
  debug = readConfig('debug', false);
  log('activated; enabled=' + enabled);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('markdownAutoPreview.enabled')) {
        enabled = readConfig('enabled', true);
        log('enabled -> ' + enabled);
      }
      if (e.affectsConfiguration('markdownAutoPreview.debug')) {
        debug = readConfig('debug', false);
      }
    }),

    vscode.window.tabGroups.onDidChangeTabs((e) => onTabsChanged(e)),

    vscode.commands.registerCommand('markdownAutoPreview.toggle', async () => {
      const cfg = vscode.workspace.getConfiguration('markdownAutoPreview');
      const next = !cfg.get('enabled', true);
      await cfg.update('enabled', next, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `Markdown Auto-Preview is now ${next ? 'ON' : 'OFF'}.`
      );
    }),

    vscode.commands.registerCommand('markdownAutoPreview.openSource', async () => {
      const uri = activeMarkdownUri();
      if (!uri) {
        vscode.window.showInformationMessage('No Markdown file is active.');
        return;
      }
      const key = uri.toString();
      sourceTabs.add(key); // make the decision stick before the tab event fires
      previewed.delete(key);
      log('command openSource -> ' + base(uri));
      await vscode.commands.executeCommand('vscode.openWith', uri, TEXT_VIEW_TYPE);
    })
  );

  // Seed state from tabs already open at activation.
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (isPreviewTab(tab)) previewed.add(tab.input.uri.toString());
      else if (isMarkdownTextTab(tab)) sourceTabs.add(tab.input.uri.toString());
    }
  }
}

function readConfig(key, fallback) {
  return vscode.workspace
    .getConfiguration('markdownAutoPreview')
    .get(key, fallback);
}

function log(msg) {
  if (!debug) return;
  if (!channel) channel = vscode.window.createOutputChannel('AIOS Markdown Auto-Preview');
  channel.appendLine(msg);
}

function base(uri) {
  return uri.path.split('/').pop();
}

function inputKind(input) {
  if (input instanceof vscode.TabInputText) return 'text';
  if (input instanceof vscode.TabInputCustom) return 'custom:' + input.viewType;
  if (input instanceof vscode.TabInputWebview) return 'webview:' + input.viewType;
  if (input instanceof vscode.TabInputNotebook) return 'notebook';
  return input ? 'other' : 'none';
}

function isMarkdownUri(uri) {
  return !!uri && uri.scheme === 'file' && /\.(md|markdown)$/i.test(uri.path);
}

function isPreviewTab(tab) {
  const input = tab && tab.input;
  return (
    input instanceof vscode.TabInputCustom &&
    input.viewType === PREVIEW_VIEW_TYPE &&
    isMarkdownUri(input.uri)
  );
}

function isMarkdownTextTab(tab) {
  const input = tab && tab.input;
  return input instanceof vscode.TabInputText && isMarkdownUri(input.uri);
}

function activeMarkdownUri() {
  const ed = vscode.window.activeTextEditor;
  if (ed && ed.document.languageId === 'markdown') return ed.document.uri;
  const tab = vscode.window.tabGroups.activeTabGroup.activeTab;
  const input = tab && tab.input;
  if (input && input.uri && isMarkdownUri(input.uri)) return input.uri;
  return undefined;
}

function onTabsChanged(e) {
  if (!enabled) return;

  if (debug) {
    for (const t of e.opened) log('  opened  ' + base(t.input.uri || vscode.Uri.parse('x:/?')) + ' [' + inputKind(t.input) + ']');
    for (const t of e.changed) log('  changed ' + base(t.input && t.input.uri ? t.input.uri : vscode.Uri.parse('x:/?')) + ' [' + inputKind(t.input) + ']');
    for (const t of e.closed) log('  closed  ' + (t.input && t.input.uri ? base(t.input.uri) : '?') + ' [' + inputKind(t.input) + ']');
  }

  // 1) Any tab that is (or became) the rendered preview: remember it as preview,
  //    and it is clearly no longer "source".
  for (const tab of [...e.opened, ...e.changed]) {
    if (isPreviewTab(tab)) {
      const key = tab.input.uri.toString();
      previewed.add(key);
      sourceTabs.delete(key);
    }
  }

  // 2a) Newly OPENED markdown text tabs = a fresh open with fresh intent.
  //     We deliberately do NOT consult `sourceTabs` here: a "keep as source"
  //     note left over from a tab that was just closed must not block a brand
  //     new open, or X-out + immediate re-click loses an event race (the open
  //     arrives before the close is processed) and wrongly stays source.
  //     Only `previewed` matters: if the file was preview a moment ago, this is
  //     "Reopen as source file" delivered as close+open -> keep source.
  for (const tab of e.opened) {
    if (!isMarkdownTextTab(tab)) continue;
    const uri = tab.input.uri;
    const key = uri.toString();

    if (swapping.has(key)) continue;

    if (previewed.has(key)) {
      previewed.delete(key);
      sourceTabs.add(key);
      log('keep-source (opened downgrade) ' + base(uri));
      continue;
    }

    log('swap->preview (opened) ' + base(uri));
    void swapToPreview(uri, tab);
  }

  // 2b) CHANGED markdown text tabs = an existing tab morphing or refocusing.
  //     THIS is where the focus/dirty "noise" lives, so here `sourceTabs` is the
  //     guard that stops a file we already decided to keep as source from
  //     bouncing back to preview.
  for (const tab of e.changed) {
    if (!isMarkdownTextTab(tab)) continue;
    const uri = tab.input.uri;
    const key = uri.toString();

    if (swapping.has(key)) continue;

    if (sourceTabs.has(key)) continue; // already decided source; ignore noise

    if (previewed.has(key)) {
      // "Reopen as source file" delivered as an in-place tab change.
      previewed.delete(key);
      sourceTabs.add(key);
      log('keep-source (changed downgrade) ' + base(uri));
      continue;
    }

    log('swap->preview (changed) ' + base(uri));
    void swapToPreview(uri, tab);
  }

  // 3) When a text tab closes, drop its remembered source decision so a future
  //    Claude link to the same file gets previewed again. (Best effort — the
  //    open-path no longer depends on this being timely, which is what fixes the
  //    race above.)
  for (const tab of e.closed) {
    if (isMarkdownTextTab(tab)) sourceTabs.delete(tab.input.uri.toString());
  }
}

async function swapToPreview(uri, tab) {
  const key = uri.toString();
  const column = tab.group && tab.group.viewColumn;
  swapping.add(key);
  previewed.add(key);
  sourceTabs.delete(key);
  try {
    await vscode.window.tabGroups.close(tab);
    await vscode.commands.executeCommand(
      'vscode.openWith',
      uri,
      PREVIEW_VIEW_TYPE,
      column
    );
  } catch (err) {
    log('swap failed: ' + (err && err.message));
    console.error('[markdownAutoPreview] swap failed:', err);
  } finally {
    swapping.delete(key);
  }
}

function deactivate() {
  if (channel) channel.dispose();
}

module.exports = { activate, deactivate };
