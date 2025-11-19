'use strict';

module.exports = {
  inputOptions: {
    filePath: './input/',
    type: 'csv',
  },
  parseOptions: {
    firstRowField: true,
    delimeter: ',',
    readLines: 10,
  },
  outputOptions: {
    sortField: 'density',
    sortType: 'desc',
    filePath: './output/',
    type: 'json',
  },
};
