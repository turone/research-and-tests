'use strict';

const fs = require('fs').promises;
const path = require('node:path');
const config = require('./config.js');

const { parse, prepareOutput, reduceArrFn } = require('./utils.js')(
  config.parse,
);
const toBool = [() => true, () => false];
const getData = async (inputName) => {
  const filePath = path.join(
    process.cwd(),
    config.input.filePath,
    `${inputName}.${config.input.type}`,
  );
  const exists = await fs.access(filePath).then(...toBool);
  return exists ? fs.readFile(filePath, 'utf8') : null;
};
const writeData = async (outputName, data) => {
  try {
    const filePath = path.join(
      process.cwd(),
      config.output.filePath,
      `${outputName}.${config.output.type}`,
    );
    const writeData =
      config.output.type === 'json' ? JSON.stringify(data) : data;
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
  const parsedData = parse(inputData, config.input.type);
  const outputData = prepareOutput(parsedData, config.output, [
    {
      nameColumn: 'density%',
      fn: (row, reduceValue) => Math.round((row.density * 100) / reduceValue),
      reduce: reduceArrFn.max,
      reduceField: 'density',
    },
  ]);
  console.table(outputData);
  console.log('writedData', await writeData(inputName, outputData));
})().catch((err) => {
  console.error(err);
});
