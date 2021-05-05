import * as vscode from 'vscode';
import { getColorContrast } from './dynamic-contrast';

export class DecorationMap {
  private _map = new Map();
  private _keys: string[] = [];

  constructor() {}

  get(color: string) {
    if (!this._map.has(color)) {
      if (color === 'transparent') {
        this._map.set(
          color,
          vscode.window.createTextEditorDecorationType({
            border: `2px solid #a0a0a0`,
          }),
        );
      } else {
        this._map.set(
          color,
          vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
            color: getColorContrast(color),
          }),
        );
      }
      this._keys.push(color);
    }
    return this._map.get(color);
  }

  keys() {
    return this._keys.slice();
  }

  dispose() {
    this._map.forEach((decoration) => {
      decoration.dispose();
    });
  }
}
