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
      };
    });

    const index = options.findIndex((x) => x.label === themeManager.themeName);

    if (index > -1) {
      const [selectedItem] = options.splice(index, 1);

      const toOptions: vscode.QuickPickItem[] = [
        { ...selectedItem, description: '(current ✅)' },
        ...options,
      ];

      const value = await vscode.window.showQuickPick(toOptions, {
        placeHolder: 'Which theme you want to use?',
      });

      if (value) {
        themeManager.setCurrentTheme(value?.label);
      }
    }
  },
);
