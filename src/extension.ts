import * as vscode from 'vscode';

import {
  migrateFileTokenCommand,
  migrateFolderTokenCommand,
  selectCurrentPaletteThemeCommand,
} from './commands';
import { bindHighlightPaletteListeners } from './listeners';
import { extensionNamespace, themeManager } from './utils';

let dispose: () => void;

function createStatusBar() {
  const barItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
  );
  barItem.command = `${extensionNamespace}.selectCurrentPaletteTheme`;
  barItem.text = getBarText();
  barItem.tooltip = 'Juno current theme name';
  barItem.show();
  return barItem;
}

function getBarText(): string {
  return `Theme: ${themeManager.themeName}`;
}

export function activate(context: vscode.ExtensionContext) {
  themeManager.init();

  const paletteStatusBarItem = createStatusBar();

  dispose = bindHighlightPaletteListeners(context);

  themeManager.onThemeChange(() => {
    paletteStatusBarItem.text = getBarText();

    dispose = bindHighlightPaletteListeners(context);
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
  themeManager.destroy();
}
