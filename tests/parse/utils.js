'use strict';
const csvOptions = {
  firstRowField: true,
  readLines: null,
  delimeter: ',',
};
const outputOptions = {
  sortType: 'desc',
};
const jsonParse = (objData) => {
  try {
    return JSON.parse(objData?.data);
  } catch {
    return null;
  }
};

const csvParse = (objData, options = {}) => {
  if (objData?.data.length === 0) return null;
  let currentPosition = 0;
  let lineBreak = null;
  if (objData.data.includes('\r\n')) {
    lineBreak = '\r\n';
  } else if (objData.data.includes('\n')) {
    lineBreak = '\n';
  }
  if (!lineBreak) return null;
  const { firstRowField, readLines, delimeter } = options;
  const results = [];
  currentPosition = objData.data.indexOf(lineBreak, currentPosition);
  const firstRow = objData.data
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
  while (currentPosition < objData.data.length) {
    if (options.readLines && lineCount >= readLines) break;
    const nextLineBreak = objData.data.indexOf(lineBreak, currentPosition);
    if (nextLineBreak === -1) break;
    const row = objData.data
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

const utils = (confOptions = {}) => ({
  parse(objData = {}, type, options = {}) {
    if (!objData?.data || objData?.data.length === 0) return null;
    const parseType = type || 'json';
    if (parseType === 'json') {
      return jsonParse(objData);
    }
    if (parseType === 'csv') {
      return csvParse(objData, { ...csvOptions, ...confOptions, ...options });
    }
    return null;
  },
  prepareOutput(arrObjData = [], options = {}, generatedColumn = []) {
    const { sortField = null, sortType } = {
      ...outputOptions,
      ...confOptions,
      ...options,
    };
    if (!arrObjData || arrObjData.length === 0) return null;
    if (!sortField) return arrObjData;
    const sortedData = arrObjData.toSorted((a, b) =>
      sortType === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField],
    );
    return sortedData.map((row) => ({
      ...row,
      ...generatedColumn,
    }));
  },
});
module.exports = (confOptions) => utils(confOptions);
