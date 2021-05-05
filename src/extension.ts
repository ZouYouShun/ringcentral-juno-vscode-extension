import * as vscode from 'vscode';

import { migrateFileTokenCommand, migrateFolderTokenCommand } from './commands';
import { bindHighlightPaletteListeners } from './listeners';

let dispose: () => void;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    migrateFileTokenCommand,
    migrateFolderTokenCommand,
  );

  dispose = bindHighlightPaletteListeners(context);
}

export function deactivate() {
  dispose();
}
