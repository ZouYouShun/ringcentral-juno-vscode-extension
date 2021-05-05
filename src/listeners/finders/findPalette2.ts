import { getPaletteColor } from './get-palette-color';

export const findPalette2 = (text: string) => {
  const regEx = /palette2\(.*\'\)/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index;
    const end = start + 'palette2'.length;

    const value = match[0];
    const palette2Keys = value
      .replace(/(palette2\(\')|(\'\))/g, '')
      .split("', '");

    const targetColor = getPaletteColor(palette2Keys);

    if (targetColor) {
      result.push({
        start,
        end,
        color: targetColor,
      });
    }
  }

  return result;
};

export const findColorObjectProp = (text: string) => {
  const regEx = /color={\'([^']*)\'/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + "color={'".length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const targetColor = getPaletteColor(palette2Keys);

    if (targetColor) {
      result.push({
        start,
        end,
        color: targetColor,
      });
    }
  }

  return result;
};

export const findColorProp = (text: string) => {
  const regEx = /color=\"([^"]*)\"/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + 'color="'.length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const targetColor = getPaletteColor(palette2Keys);

    if (targetColor) {
      result.push({
        start,
        end,
        color: targetColor,
      });
    }
  }

  return result;
};

export const findColorField = (text: string) => {
  const regEx = /color: \'([^']*)\'/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + "color: '".length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const targetColor = getPaletteColor(palette2Keys);

    if (targetColor) {
      result.push({
        start,
        end,
        color: targetColor,
      });
    }
  }

  return result;
};
