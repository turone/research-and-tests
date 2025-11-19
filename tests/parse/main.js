'use strict';

const fs = require('fs').promises;
const path = require('node:path');
const config = require('./config.js');
const { inputOptions, outputOptions, parseOptions } = config;
const utils = require('./utils.js');
const { parse, prepareOutput, reduceArrFn } = utils(parseOptions);
const toBool = [() => true, () => false];
const getData = async (inputName) => {
  const filePath = path.join(
    process.cwd(),
    inputOptions.filePath,
    `${inputName}.${inputOptions.type}`,
  );
  const exists = await fs.access(filePath).then(...toBool);
  return exists ? await fs.readFile(filePath, 'utf8') : undefined;
};
const outputData = async (outputName, data) => {
  try {
    const filePath = path.join(
      process.cwd(),
      outputOptions.filePath,
      `${outputName}.${outputOptions.type}`,
    );
    const writeData =
      outputOptions.type === 'json' ? JSON.stringify(data) : data;
    await fs.writeFile(filePath, writeData, 'utf8'); // Асинхронная запись
    return {
      success: true,
      message: `Data written successfully to ${filePath}`,
    };
  } catch (error) {
    console.error('Error writing data:', error);
    return { success: false, message: 'Error writing data', error };
  }
};
(async () => {
  const inputName = 'capitals';
  const inputData = await getData(inputName);
  if (!inputData) {
    console.error(`File ${inputName} not found`);
    return;
  }
  const parsedData = parse(inputData, inputOptions.type);
  const preparedData = prepareOutput(
    parsedData,
    [
      {
        nameColumn: 'density%',
        fn: (row, reduceValue) => Math.round((row.density * 100) / reduceValue),
        reduce: reduceArrFn.max,
        reduceField: 'density',
      },
    ],
    outputOptions,
  );
  console.table(preparedData);
  console.log('writedData', await outputData(inputName, preparedData));
})().catch((err) => {
  console.error(err);
});
