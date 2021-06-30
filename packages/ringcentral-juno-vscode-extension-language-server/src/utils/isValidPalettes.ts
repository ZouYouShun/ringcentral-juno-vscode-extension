const ignorePaletteKeys = [
  ...[
    'vDisabled',
    'vNeutral',
    'vDanger',
    'vDisabled',
    'text',
    'primary',
    'secondary',
    'info',
    'grey',
    'error',
    'common',
    'background',
    'action',
  ].map((x) => `${x}\\.`),
  'success.light',
  'success.main',
  'warning.light',
  'warning.main',
  '.contrastText',
  '.dark',
  'divider',
  'type',
];

const includePalettes = [
  'header.divider',
  'action.grayLight',
  'action.grayDark',
  'action.primary',
];

function stringArrToRegExp(keyToTags?: string[]): RegExp {
  return new RegExp(keyToTags?.join('|') || '', 'g');
}

export const isValidPalettes = (x: string) => {
  try {
    return (
      !x.match(stringArrToRegExp(ignorePaletteKeys)) ||
      includePalettes.includes(x)
    );
  } catch (error) {
    return false;
  }
};
