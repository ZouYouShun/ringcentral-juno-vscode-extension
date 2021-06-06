import { getPaletteColor } from './get-palette-color';

const getResult = ({ isGetColor, start, end, palette2Keys }: any) => {
  if (isGetColor) {
    return {
      start,
      end,
      paletteKeys: palette2Keys,
    };
  }

  const targetColor = getPaletteColor(palette2Keys);

  if (targetColor && typeof targetColor === 'string') {
    return {
      start,
      end,
      color: targetColor,
      paletteKeys: palette2Keys,
    };
  }

  return null;
};

export const findScssRcPalette = (text: string, isGetColor = false) => {
  const regEx = /rc-palette\(([^()]+)\)/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + 'rc-palette('.length;
    const end = start + match[1].length;

    const palette2Keys = match[1].replace(/\'/g, '').split(', ');

    const item = getResult({ isGetColor, start, end, palette2Keys });

    if (item) {
      result.push(item);
    }
  }

  return result;
};

export const findPalette2 = (text: string, isGetColor = false) => {
  const regEx = /palette2\(([^()]+)\)/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + 'palette2('.length;
    const end = start + match[1].length;

    const palette2Keys = match[1].replace(/\'|\"/g, '').split(', ');

    const item = getResult({ isGetColor, start, end, palette2Keys });

    if (item) {
      result.push(item);
    }
  }

  return result;
};

export const findColorObjectProp = (text: string, isGetColor = false) => {
  const regEx = /color={\'([^']*)\'/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + "color={'".length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const item = getResult({ isGetColor, start, end, palette2Keys });

    if (item) {
      result.push(item);
    }
  }

  return result;
};

export const findColorProp = (text: string, isGetColor = false) => {
  const regEx = /color=\"([^"]*)\"/g;

  const result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + 'color="'.length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const item = getResult({ isGetColor, start, end, palette2Keys });

    if (item) {
      result.push(item);
    }
  }

  return result;
};

export const findColorField = (text: string, isGetColor = false) => {
  const regEx = /color: \'([^']*)\'/g;

  let result = [];
  let match;

  while ((match = regEx.exec(text))) {
    const start = match.index + "color: '".length;
    const end = start + match[1].length;

    const palette2Keys = match[1].split('.');

    const item = getResult({ isGetColor, start, end, palette2Keys });

    if (item) {
      result.push(item);
    }
  }

  return result;
};
