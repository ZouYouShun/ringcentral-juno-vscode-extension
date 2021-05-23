import * as vscode from 'vscode';

import { extensionNamespace, themeManager } from '../utils';

export const selectCurrentPaletteThemeCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.selectCurrentPaletteTheme`,
  async () => {
    const options = [
      'default',
      ...Object.keys(themeManager.themeMap),
    ].map<vscode.QuickPickItem>((label) => {
      return {
        label,
        description: themeManager.themeName === label ? '(current ✅)' : '',
      };
    });

    const value = await vscode.window.showQuickPick(options, {
      placeHolder: 'Which theme you want to use?',
    });

    if (value) {
      themeManager.setCurrentTheme(value?.label);
    }
  },
);
