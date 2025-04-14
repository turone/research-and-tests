'use strict';

const { read } = require("fs");

module.exports = {
  input: {
    filePath: './input/',
    type: 'csv',
  },
  parse: {
    firstRowField: true,
    delimeter: ',',
    readLines: 10,
  },
  output: {
    sortField: 'density',
    sortType: 'desc',
    filePath: './output/',
    type: 'json',
  },
};
