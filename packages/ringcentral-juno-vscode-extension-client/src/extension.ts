import * as path from 'path';
import * as vscode from 'vscode';

import {
  migrateFileTokenCommand,
  migrateFolderTokenCommand,
  selectCurrentPaletteThemeCommand,
} from './commands';
import { createStatusBar, getBarText } from './createStatusBar';
import { initLanguageClient, languageClient } from './languageClient';
import { bindHighlightPaletteListeners } from './listeners';
import { themeManager } from './utils';

let dispose: () => void;
let disposeLanguageServer: () => void;

export function activate(context: vscode.ExtensionContext) {
  themeManager.init();
  // TODO: send theme to server

  /**
   * init status bar
   */
  const paletteStatusBarItem = createStatusBar();

  /**
   * bind syntax highlight
   */
  dispose = bindHighlightPaletteListeners(context);

  themeManager.onThemeChange((palette) => {
    paletteStatusBarItem.text = getBarText();

    dispose = bindHighlightPaletteListeners(context);

    // TODO: send theme to server
    // executeCommand('juno-server.showCompletion');

    languageClient.sendRequest('juno-theme-change', palette).then((data) => {
      console.log(data);
    });
  });

  /**
   * connect language server
   */
  const serverModule = context.asAbsolutePath(
    path.join('out', 'server', 'server.js'),
  );

  disposeLanguageServer = initLanguageClient({ serverPath: serverModule });

  languageClient.start();

  languageClient.onReady().then(() => {
    languageClient.onRequest('init', () => {
      return themeManager.palette;
    });
  });

  context.subscriptions.push(
    migrateFileTokenCommand,
    migrateFolderTokenCommand,
    selectCurrentPaletteThemeCommand,
    paletteStatusBarItem,
  );
}

export function deactivate() {
  dispose();
  disposeLanguageServer();

  themeManager.destroy();
}
