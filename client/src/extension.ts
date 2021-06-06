import * as path from 'path';
import * as vscode from 'vscode';

import {
  migrateFileTokenCommand,
  migrateFolderTokenCommand,
  selectCurrentPaletteThemeCommand,
} from './commands';
import { createStatusBar, getBarText } from './createStatusBar';
import { initLanguageClient } from './languageClient';
import { bindHighlightPaletteListeners } from './listeners';
import { themeManager } from './utils';

let dispose: () => void;
let disposeLanguageServer: () => void;

export function activate(context: vscode.ExtensionContext) {
  themeManager.init();

  /**
   * init status bar
   */
  const paletteStatusBarItem = createStatusBar();

  /**
   * bind syntax highlight
   */
  dispose = bindHighlightPaletteListeners(context);

  themeManager.onThemeChange(() => {
    paletteStatusBarItem.text = getBarText();

    dispose = bindHighlightPaletteListeners(context);
  });

  /**
   * connect language server
   */
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js'),
  );

  disposeLanguageServer = initLanguageClient({ serverPath: serverModule });

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
