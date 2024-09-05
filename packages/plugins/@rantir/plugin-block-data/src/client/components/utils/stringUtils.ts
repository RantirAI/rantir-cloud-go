function sortStringsByFloats(strings: string[], floats: number[]) {
  // Create an object that maps each string to its corresponding float value
  const stringToFloatMap = strings.reduce((map: { [key: string]: number }, str, index) => {
    map[str] = floats[index];
    return map;
  }, {});

  // Sort
  return strings.sort((a, b) => stringToFloatMap[b] - stringToFloatMap[a]);
}

export { sortStringsByFloats };
