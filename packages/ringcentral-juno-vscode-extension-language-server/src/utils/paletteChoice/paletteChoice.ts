import * as additionPalette from 'ringcentral-juno-vscode-extension-client/src/listeners/finders/additionPalette.json';

const loopGetValue = (
  acc: any[],
  obj: any,
  handleKeyFn: (value: string[]) => any,
  parentKey: string[] = [],
) => {
  Object.entries(obj).forEach(([key, value]) => {
    switch (typeof value) {
      case 'object':
        loopGetValue(acc, value, handleKeyFn, [...parentKey, key]);
        break;
      case 'string':
        acc.push({ key: handleKeyFn([...parentKey, key]), value });
        break;

      default:
        break;
    }
  });
};

export const themeManager = { palette: additionPalette as any };

export const getPaletteChoice = (
  handleKeyFn: (value: string[]) => any = (value) => value,
) => {
  const arr: any[] = [];

  loopGetValue(arr, themeManager.palette, handleKeyFn);

  return arr;
};