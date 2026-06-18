'use strict';

const vscode = require('vscode');

/**
 * AIOS HTML Preview
 * -----------------
 * Two cooperating pieces, so a .html opens as a rendered preview no matter how
 * it was opened:
 *
 *  1. A custom editor for *.html (`aios.htmlPreview`) that renders the file in a
 *     webview instead of showing its source. Registered with priority "option",
 *     so it does nothing by itself — a workspace opts in with:
 *         "workbench.editorAssociations": { "*.html": "aios.htmlPreview" }
 *     That covers opens that respect editor associations (Explorer, Quick Open).
 *
 *  2. A tab-watcher (mirrors the sibling vscode-markdown-auto-preview) for the
 *     one case associations can't reach: the Claude Code chat panel force-opens
 *     links as raw SOURCE, ignoring associations. When an .html file appears as
 *     a *source* (text) editor we did NOT expect, we close it and reopen it with
 *     the custom editor above. Net effect: click an .html chat link, it opens
 *     rendered. (Brief source flash.)
 *
 * As with the markdown sibling, the hard part is letting "Reopen as source file"
 * stick. We classify each html file by intent and REMEMBER it, because
 * onDidChangeTabs fires `changed` events for unrelated reasons (focus, dirty
 * state, group moves) and we must not re-swap on those:
 *   - A text editor for a file we did NOT just show as preview = a forced-source
 *     open (Claude link) -> swap it to preview.
 *   - A text editor for a file that WAS just preview = a deliberate downgrade
 *     ("Reopen as source file", or our own command) -> leave as source AND
 *     record it in `sourceTabs` so later change events don't bounce it back.
 *   - `sourceTabs` is cleared only when that text tab actually closes.
 *
 * "Was just preview" is judged by RECENCY, not a sticky flag: when a preview tab
 * closes we drop it from `previewed` and timestamp the close. A source open is a
 * downgrade only if a preview is still open OR closed within DOWNGRADE_WINDOW_MS
 * (the near-instant close+open of "Reopen as source"). Closing a preview and
 * reopening the same file later is past the window, so it correctly re-swaps —
 * without this, the file stayed stuck in `previewed` and every other reopen
 * wrongly kept source.
 */

const VIEW_TYPE = 'aios.htmlPreview';
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
// One-shot "the user explicitly asked for source" intent, set ONLY by the
// openSource command and consumed by the very next source open. Unlike
// `sourceTabs` (a lingering memory that 2a must ignore, or an X-out + re-click
// loses the event race), this is short-lived and unambiguous, so 2a/2b CAN
// trust it: it means the close+reopen this command just issued must land as
// source, not get swapped back to preview.
const forceSource = new Set();
// Preview tabs that have CLOSED, mapped to when (ms). A downgrade whose close and
// open land in the SAME tab-change event is already caught below (the close
// handler runs last, so `previewed` is still set when the open is processed).
// This window only covers a downgrade SPLIT across events — which is programmatic
// ("Reopen as source"), so it lands within a few ms. Kept short (300ms) so a
// human who closes a preview and re-clicks the chat link a moment later gets
// preview again, not source.
const closedPreviewAt = new Map();
const DOWNGRADE_WINDOW_MS = 300;

function activate(context) {
  enabled = readConfig('enabled', true);
  debug = readConfig('debug', false);
  log('activated; enabled=' + enabled);

  const provider = new HtmlPreviewProvider();
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(VIEW_TYPE, provider, {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    }),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('htmlPreview.enabled')) {
        enabled = readConfig('enabled', true);
        log('enabled -> ' + enabled);
      }
      if (e.affectsConfiguration('htmlPreview.debug')) {
        debug = readConfig('debug', false);
      }
    }),

    vscode.window.tabGroups.onDidChangeTabs((e) => onTabsChanged(e)),

    vscode.commands.registerCommand('htmlPreview.toggle', async () => {
      const cfg = vscode.workspace.getConfiguration('htmlPreview');
      const next = !cfg.get('enabled', true);
      await cfg.update('enabled', next, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `HTML Auto-Preview is now ${next ? 'ON' : 'OFF'}.`
      );
    }),

    vscode.commands.registerCommand('htmlPreview.openSource', async () => {
      const uri = activeHtmlUri();
      if (!uri) {
        vscode.window.showInformationMessage('No HTML file is active.');
        return;
      }
      const key = uri.toString();
      forceSource.add(key); // explicit intent the watcher honors (see set decl)
      sourceTabs.add(key); // make the decision stick before the tab event fires
      previewed.delete(key);
      log('command openSource -> ' + base(uri));

      // Replace the preview in place (like markdown's button) rather than
      // opening source in a second tab: close the preview tab, then reopen the
      // file as source in the same editor column.
      const previewTab = findPreviewTab(uri);
      const column =
        (previewTab && previewTab.group && previewTab.group.viewColumn) ||
        (vscode.window.tabGroups.activeTabGroup &&
          vscode.window.tabGroups.activeTabGroup.viewColumn);
      if (previewTab) {
        try {
          await vscode.window.tabGroups.close(previewTab);
        } catch (err) {
          log('openSource close-preview failed: ' + (err && err.message));
        }
      }
      await vscode.commands.executeCommand(
        'vscode.openWith',
        uri,
        TEXT_VIEW_TYPE,
        column
      );
    })
  );

  // Seed state from tabs already open at activation.
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (isPreviewTab(tab)) previewed.add(tab.input.uri.toString());
      else if (isHtmlTextTab(tab)) sourceTabs.add(tab.input.uri.toString());
    }
  }
}

function readConfig(key, fallback) {
  return vscode.workspace.getConfiguration('htmlPreview').get(key, fallback);
}

function log(msg) {
  if (!debug) return;
  if (!channel) channel = vscode.window.createOutputChannel('AIOS HTML Preview');
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

function isHtmlUri(uri) {
  return !!uri && uri.scheme === 'file' && /\.html?$/i.test(uri.path);
}

function isPreviewTab(tab) {
  const input = tab && tab.input;
  return (
    input instanceof vscode.TabInputCustom &&
    input.viewType === VIEW_TYPE &&
    isHtmlUri(input.uri)
  );
}

function isHtmlTextTab(tab) {
  const input = tab && tab.input;
  return input instanceof vscode.TabInputText && isHtmlUri(input.uri);
}

// True if `key`'s preview tab closed within the downgrade window — i.e. recently
// enough that an opening source tab is the close+open form of "Reopen as source"
// rather than a fresh reopen that should swap back to preview.
function recentlyClosedPreview(key) {
  const t = closedPreviewAt.get(key);
  return t !== undefined && Date.now() - t < DOWNGRADE_WINDOW_MS;
}

// The open preview tab for `uri`, if any (so openSource can close it and replace
// it in place instead of opening a second tab).
function findPreviewTab(uri) {
  const key = uri.toString();
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (isPreviewTab(tab) && tab.input.uri.toString() === key) return tab;
    }
  }
  return undefined;
}

function activeHtmlUri() {
  const ed = vscode.window.activeTextEditor;
  if (ed && isHtmlUri(ed.document.uri)) return ed.document.uri;
  const tab = vscode.window.tabGroups.activeTabGroup.activeTab;
  const input = tab && tab.input;
  if (input && input.uri && isHtmlUri(input.uri)) return input.uri;
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
      closedPreviewAt.delete(key); // preview is live again; no stale close-stamp
    }
  }

  // 2a) Newly OPENED html text tabs = a fresh open with fresh intent.
  //     We deliberately do NOT consult `sourceTabs` here: a "keep as source"
  //     note left over from a tab that was just closed must not block a brand
  //     new open, or X-out + immediate re-click loses an event race (the open
  //     arrives before the close is processed) and wrongly stays source.
  //     Only `previewed` matters: if the file was preview a moment ago, this is
  //     "Reopen as source file" delivered as close+open -> keep source.
  for (const tab of e.opened) {
    if (!isHtmlTextTab(tab)) continue;
    const uri = tab.input.uri;
    const key = uri.toString();

    if (swapping.has(key)) continue;

    if (forceSource.has(key)) {
      // The openSource command just asked for this; never swap it back.
      forceSource.delete(key);
      previewed.delete(key);
      closedPreviewAt.delete(key);
      sourceTabs.add(key);
      log('keep-source (opened, explicit command) ' + base(uri));
      continue;
    }

    if (previewed.has(key) || recentlyClosedPreview(key)) {
      const via = previewed.has(key) ? 'previewed' : 'recency';
      previewed.delete(key);
      closedPreviewAt.delete(key);
      sourceTabs.add(key);
      log('keep-source (opened downgrade, via ' + via + ') ' + base(uri));
      continue;
    }

    log('swap->preview (opened) ' + base(uri));
    void swapToPreview(uri, tab);
  }

  // 2b) CHANGED html text tabs = an existing tab morphing or refocusing.
  //     THIS is where the focus/dirty "noise" lives, so here `sourceTabs` is the
  //     guard that stops a file we already decided to keep as source from
  //     bouncing back to preview.
  for (const tab of e.changed) {
    if (!isHtmlTextTab(tab)) continue;
    const uri = tab.input.uri;
    const key = uri.toString();

    if (swapping.has(key)) continue;

    if (forceSource.has(key)) {
      // The openSource command just asked for this; never swap it back.
      forceSource.delete(key);
      previewed.delete(key);
      closedPreviewAt.delete(key);
      sourceTabs.add(key);
      log('keep-source (changed, explicit command) ' + base(uri));
      continue;
    }

    if (sourceTabs.has(key)) continue; // already decided source; ignore noise

    if (previewed.has(key) || recentlyClosedPreview(key)) {
      // "Reopen as source file" delivered as an in-place tab change.
      const via = previewed.has(key) ? 'previewed' : 'recency';
      previewed.delete(key);
      closedPreviewAt.delete(key);
      sourceTabs.add(key);
      log('keep-source (changed downgrade, via ' + via + ') ' + base(uri));
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
    if (isHtmlTextTab(tab)) sourceTabs.delete(tab.input.uri.toString());
    // A closing PREVIEW must drop out of `previewed` (or it stays stuck there and
    // the next reopen is wrongly read as a downgrade) — timestamped so the
    // close+open of "Reopen as source" within the window still keeps source.
    if (isPreviewTab(tab)) {
      const key = tab.input.uri.toString();
      previewed.delete(key);
      closedPreviewAt.set(key, Date.now());
    }
  }
}

async function swapToPreview(uri, tab) {
  const key = uri.toString();
  const column = tab.group && tab.group.viewColumn;
  swapping.add(key);
  previewed.add(key);
  sourceTabs.delete(key);
  closedPreviewAt.delete(key);
  try {
    await vscode.window.tabGroups.close(tab);
    await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE, column);
  } catch (err) {
    log('swap failed: ' + (err && err.message));
    console.error('[htmlPreview] swap failed:', err);
  } finally {
    swapping.delete(key);
  }
}

class HtmlPreviewProvider {
  /**
   * @param {vscode.TextDocument} document
   * @param {vscode.WebviewPanel} webviewPanel
   */
  resolveCustomTextEditor(document, webviewPanel) {
    const dir = vscode.Uri.joinPath(document.uri, '..');

    // Allow the webview to load local resources from the file's folder and,
    // if there is one, the enclosing workspace folder (covers ../shared refs).
    const roots = [dir];
    const wsFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (wsFolder) {
      roots.push(wsFolder.uri);
    }

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: roots,
    };

    const render = () => {
      webviewPanel.webview.html = buildHtml(webviewPanel.webview, document, dir);
    };
    render();

    // Live-reload: if the same document changes (e.g. edited in a split
    // text editor), re-render the preview.
    const changeSub = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        render();
      }
    });

    webviewPanel.onDidDispose(() => changeSub.dispose());
  }
}

/**
 * Inject a <base> tag so relative resources (./style.css, ./app.js, images)
 * resolve through the webview's resource URI scheme. The artifact's own
 * inline scripts and CDN <script>/<link> tags run untouched.
 *
 * @param {vscode.Webview} webview
 * @param {vscode.TextDocument} document
 * @param {vscode.Uri} dir
 */
function buildHtml(webview, document, dir) {
  const baseHref = webview.asWebviewUri(dir).toString();
  const baseTag = `<base href="${baseHref}/">`;
  let html = document.getText();

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n  ${baseTag}`);
  } else if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html([^>]*)>/i, `<html$1>\n<head>${baseTag}</head>`);
  } else {
    html = `${baseTag}\n${html}`;
  }

  return html;
}

function deactivate() {
  if (channel) channel.dispose();
}

module.exports = { activate, deactivate };
