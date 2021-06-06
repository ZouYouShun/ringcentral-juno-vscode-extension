import * as additionPalette from 'ringcentral-juno-vscode-extension-client/src/listeners/finders/additionPalette.json';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';

import { getPaletteChoice } from './paletteChoice';

class ThemeManager {
  paletteItems: any[] = [];

  stringPaletteItems: any;
  palette2PaletteItems: any;

  constructor() {}

  updatePalette(palette: any = additionPalette) {
    this.paletteItems = getPaletteChoice(palette, (value) => value.join('.'));

    this.stringPaletteItems = this.paletteItems.map<CompletionItem>((x) => {
      return {
        label: x.key,
        kind: CompletionItemKind.Color,
        documentation: x.value,
        sortText: '0',
      };
    });

    this.palette2PaletteItems = this.paletteItems.map<CompletionItem>((x) => {
      const value: string[] = x.key.split('.');

      const label = `'${value.join("', '")}'`;

      return {
        label,
        filterText: x.key,
        kind: CompletionItemKind.Color,
        documentation: x.value,
        sortText: '0',
      };
    });
  }
}

export const themeManager = new ThemeManager();
