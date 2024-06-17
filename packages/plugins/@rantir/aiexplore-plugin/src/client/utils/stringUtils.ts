/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

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
