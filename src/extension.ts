import * as vscode from 'vscode';

import { migrateFileTokenCommand, migrateFolderTokenCommand } from './commands';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    migrateFileTokenCommand,
    migrateFolderTokenCommand,
  );
}

export function deactivate() {}
