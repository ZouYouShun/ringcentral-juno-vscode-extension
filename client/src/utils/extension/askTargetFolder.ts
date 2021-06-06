import * as path from 'path';
import * as vscode from 'vscode';

import { showInputBox } from './showInputBox';

export function askTargetFolder(message: string = 'target folder:') {
  const dirPath = vscode.window.activeTextEditor
    ? path.dirname(vscode.window.activeTextEditor.document.fileName)
    : vscode.workspace.workspaceFolders?.[0].uri.path;

  return showInputBox({
    placeHolder: message,
    value: dirPath,
  });
}
