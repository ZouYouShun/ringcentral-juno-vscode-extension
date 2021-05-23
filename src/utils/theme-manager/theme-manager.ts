import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { extensionNamespace } from '../extensionNamespace';
import * as additionPalette from './additionPalette.json';

class ThemeManager {
  /** emit whole theme object */
  eventEmitter = new vscode.EventEmitter<any>();

  themeName: string = 'default';
  themeMap: Record<string, any> = {};

  get theme() {
    return this.themeMap[this.themeName];
  }

  get palette() {
    return this.theme?.palette || additionPalette;
  }

  constructor() {}

  init() {
    const currentThemeName = vscode.workspace
      .getConfiguration(extensionNamespace)
      .get<string>('currentTheme');

    if (currentThemeName) {
      this.themeName = currentThemeName;
    }

    const themeMap = vscode.workspace
      .getConfiguration(extensionNamespace)
      .get<Object>('themeMap');

    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.path;
    if (themeMap && rootPath) {
      this.themeMap = Object.entries(themeMap).reduce<any>(
        (acc, [key, url]) => {
          const filePath = path.join(rootPath, url);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            const object = require(filePath);
            console.log(object);
            acc[key] = object;
          }

          return acc;
        },
        {},
      );
    }

    this.setCurrentTheme(this.themeName);
  }

  setCurrentTheme(themeName: string) {
    if (themeName && themeName !== this.themeName) {
      this.themeName = themeName;

      this.eventEmitter.fire(this.palette);
    }
  }

  get onThemeChange(): vscode.Event<void> {
    return this.eventEmitter.event;
  }
}

export const themeManager = new ThemeManager();
