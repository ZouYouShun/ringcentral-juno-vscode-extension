import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';

import { getPaletteChoice } from './paletteChoice';

export const paletteItems = getPaletteChoice((value) => value.join('.'));

export const stringPaletteItems = paletteItems.map<CompletionItem>((x) => {
  return {
    label: x.key,
    kind: CompletionItemKind.Color,
    documentation: x.value,
    sortText: '0',
  };
});

export const palette2PaletteItems = paletteItems.map<CompletionItem>((x) => {
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
