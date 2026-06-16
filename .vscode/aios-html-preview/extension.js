'use strict';

const vscode = require('vscode');

/**
 * AIOS HTML Preview
 * -----------------
 * Registers a custom editor for *.html that renders the file in a webview
 * instead of showing its source. The editor is registered with
 * priority "option", so installing the extension changes nothing by itself —
 * a workspace opts in with:
 *
 *   "workbench.editorAssociations": { "*.html": "aios.htmlPreview" }
 *
 * Remove that line (or use right-click -> Open With -> Text Editor) to edit
 * the source again.
 */

const VIEW_TYPE = 'aios.htmlPreview';

function activate(context) {
  const provider = new HtmlPreviewProvider();
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(VIEW_TYPE, provider, {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    })
  );
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

function deactivate() {}

module.exports = { activate, deactivate };
