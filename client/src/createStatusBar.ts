import * as vscode from 'vscode';

import { extensionNamespace, themeManager } from './utils';

export function createStatusBar() {
  const barItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
  );
  barItem.command = `${extensionNamespace}.selectCurrentPaletteTheme`;
  barItem.text = getBarText();
  barItem.tooltip = 'Juno current theme name';
  barItem.show();
  return barItem;
}

export function getBarText(): string {
  return `Theme: ${themeManager.themeName}`;
}
