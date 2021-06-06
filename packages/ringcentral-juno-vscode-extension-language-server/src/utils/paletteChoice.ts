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

export const getPaletteChoice = (
  palette: any,
  handleKeyFn: (value: string[]) => any = (value) => value,
) => {
  const arr: any[] = [];

  loopGetValue(arr, palette, handleKeyFn);

  return arr;
};
