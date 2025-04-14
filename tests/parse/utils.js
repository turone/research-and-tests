'use strict';
const csvOptions = {
  firstRowField: true,
  readLines: null,
  delimeter: ',',
};
const outputOptions = {
  sortType: 'desc',
};
const jsonParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const csvParse = (data, options = {}) => {
  if (data?.length === 0) return null;
  let currentPosition = 0;
  let lineBreak = null;
  if (data.includes('\r\n')) {
    lineBreak = '\r\n';
  } else if (data.includes('\n')) {
    lineBreak = '\n';
  }
  if (!lineBreak) return null;
  const { firstRowField, readLines, delimeter } = options;
  const results = [];
  currentPosition = data.indexOf(lineBreak, currentPosition);
  const firstRow = data
    .slice(0, currentPosition)
    .split(delimeter)
    .map((field) => field.trim());
  const fieldNames = firstRowField
    ? firstRow
    : firstRow.map((_, index) => index.toString());
  const rowToResult = (row) => {
    if (row.length === 0) return;
    try {
      const objCells = {};
      for (const [i, value] of fieldNames.entries()) {
        objCells[value] = row[i] ?? '';
      }
      results.push(objCells);
    } catch (error) {
      console.error('Error parsing row:', error);
      return;
    }
  };
  if (!firstRowField) {
    void rowToResult(firstRow);
  }
  currentPosition += lineBreak.length;
  let lineCount = 1;
  while (currentPosition < data.length) {
    if (options.readLines && lineCount >= readLines) break;
    const nextLineBreak = data.indexOf(lineBreak, currentPosition);
    if (nextLineBreak === -1) break;
    const row = data
      .slice(currentPosition, nextLineBreak)
      .split(delimeter)
      .map((field) => field.trim());
    void rowToResult(row);
    currentPosition = nextLineBreak + lineBreak.length;
    lineCount += 1;
    if (readLines && lineCount >= readLines) break;
  }
  return results.length ? results : null;
};
const createReduceProxy = (reduceFn, field) => {
  return new Proxy(reduceFn, {
    apply(target, thisArg, args) {
      const [acc, value, ...rest] = args;
      const modifiedValue =
        field && value && value[field] !== undefined ? value[field] : value;
      return Reflect.apply(target, thisArg, [acc, modifiedValue, ...rest]);
    },
  });
};

const utils = (confOptions = {}) => ({
  parse(data, type, options = {}) {
    if (!data || data.length === 0) return null;
    const parseType = type || 'json';
    if (parseType === 'json') {
      return jsonParse(data);
    }
    if (parseType === 'csv') {
      return csvParse(data, { ...csvOptions, ...confOptions, ...options });
    }
    return null;
  },
  reduceArrFn: {
    sum: (acc, value) => (acc >>> 0) + Number(value),
    avg: (acc, value, index, arr) => (acc >>> 0) + value / arr.length,
    min: (acc, value) => Math.min(acc || Infinity, value),
    max: (acc, value) => Math.max(acc || -Infinity, value),
  },
  prepareOutput(arrObjData = [], options = {}, toGeneratedColumn = []) {
    const { sortField = null, sortType } = {
      ...outputOptions,
      ...confOptions,
      ...options,
    };
    if (!arrObjData || arrObjData.length === 0) return null;
    const results = [];
    if (toGeneratedColumn.length !== 0) {
      for (const colFn of toGeneratedColumn) {
        const { reduce = null, reduceField } = colFn;
        if (typeof reduce === 'function' && reduceField) {
          const reduceFn = createReduceProxy(reduce, reduceField);
          colFn.reduceValue = arrObjData.reduce(reduceFn);
        } else {
          colFn.reduceValue = reduce;
        }
      }
      for (const arrObjDataItem of arrObjData) {
        for (const [key, colFn] of toGeneratedColumn.entries()) {
          const { nameColumn, fn, reduceValue } = colFn;
          const nameCol =
            nameColumn !== undefined
              ? nameColumn
              : arrObjDataItem.length + key + 1;
          if (typeof fn !== 'function') {
            console.error('Invalid function for column:', nameCol);
          }
          arrObjDataItem[nameColumn] = fn(arrObjDataItem, reduceValue) ?? null;
        }
        results.push(arrObjDataItem);
      }
      for (const colFn of toGeneratedColumn) {
        const { nameColumn, fn } = colFn;
        if (typeof fn !== 'function') {
          console.error('Invalid function for column:', nameColumn);
          continue;
        }
      }
    }
    const sortedData = !sortField
      ? arrObjData
      : arrObjData.toSorted((a, b) =>
          sortType === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField],
        );

    return sortedData;
  },
});
module.exports = (confOptions) => utils(confOptions);
