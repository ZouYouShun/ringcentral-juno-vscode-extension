import * as vscode from 'vscode';

import {
  migrateFileTokenCommand,
  migrateFolderTokenCommand,
  selectCurrentPaletteThemeCommand,
} from './commands';
import { bindHighlightPaletteListeners } from './listeners';
import { themeManager } from './utils';

let dispose: () => void;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    migrateFileTokenCommand,
    migrateFolderTokenCommand,
    selectCurrentPaletteThemeCommand,
  );

  themeManager.init();

  dispose = bindHighlightPaletteListeners(context);

  themeManager.onThemeChange(() => {
    dispose = bindHighlightPaletteListeners(context);
  });
}

export function deactivate() {
  dispose();
}
