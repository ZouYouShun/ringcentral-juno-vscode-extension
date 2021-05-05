import * as additionPalette from './additionPalette.json';

export const getPaletteColor = (palette2Keys: string[]) => {
  const targetColor = palette2Keys.reduce((acc, curr, i) => {
    // TODO: should remove that, use setOptions
    if (i === palette2Keys.length - 1) {
      if (typeof curr === 'number') {
        // return doAlpha(acc, curr, theme);
      }
    }
    // eslint-disable-next-line eqeqeq
    return acc == null ? '' : (acc as any)[curr];
  }, additionPalette);

  return targetColor;
};
