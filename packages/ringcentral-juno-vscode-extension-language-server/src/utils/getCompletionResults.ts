import { Position } from 'vscode-languageserver-textdocument';
import { CompletionItem } from 'vscode-languageserver/node';

import { themeManager } from './theme-manager';

export function getCompletionResults(text: string, position: Position) {
  const check = (
    regEx: RegExp,
    additionValue: string,
    returnObj: CompletionItem[],
  ) => {
    const result3 = regEx.exec(text);

    if (
      result3 &&
      result3.index + additionValue.length === position.character + 1
    ) {
      return returnObj;
    }

    return false;
  };

  const { stringPaletteItems, palette2PaletteItems } = themeManager;

  // findColorProp
  return (
    check(/color=\"([^"]*)\"/g, 'color=""', stringPaletteItems) ||
    // findColorField
    check(/color: \'([^']*)\'/g, "color: ''", stringPaletteItems) ||
    // findColorField
    check(/palette2\(\)/g, 'palette2()', palette2PaletteItems) ||
    // findScssRcPalette
    check(/rc-palette\(\)/g, 'rc-palette()', palette2PaletteItems) ||
    []
  );
}
