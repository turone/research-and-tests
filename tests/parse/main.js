'use strict';

const fs = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');

const { parse, prepareOutput } = require('./utils.js')(config.parse);

const getData = async (inputName) => {
  const filePath = path.join(
    process.cwd(),
    config.input.filePath,
    `${inputName}.${config.input.type}`,
  );
  const toBool = [() => true, () => false];
  const exists = await fs.access(filePath).then(...toBool);
  return exists ? fs.readFile(filePath, 'utf8') : null;
};
(async () => {
  const inputName = 'capitals';
  const parsedData = parse(
    { data: await getData(inputName) },
    config.input.type,
  );
  console.log('parsedData',parsedData);
  const outputData = prepareOutput(parsedData, config.output);
  console.table(outputData);
})().catch((err) => {
  console.error(err);
});

// const data = require('./data.js');
// console.log(data);
// const parse = require('./parse.js');
// console.log(parse);
