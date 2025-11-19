'use strict';

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const schema = [
  { index: 0, name: 'city', type: 'string', size: 18 },
  { index: 1, name: 'population', type: 'number', size: 10 },
  { index: 2, name: 'area', type: 'number', size: 8 },
  { index: 3, name: 'density', type: 'number', size: 8 },
  { index: 4, name: 'country', type: 'string', size: 18 },
  { index: 5, name: 'crowding', type: 'number', size: 6 },
];

class City {
  #dataset;

  constructor(dataset, fields) {
    const { city, population, area, density, country } = fields;
    this.#dataset = dataset;
    this.name = city;
    this.population = parseInt(population);
    this.area = parseInt(area);
    this.density = parseInt(density);
    this.country = country;
  }

  get crowding() {
    return this.#dataset.getRelativeDensity(this.density);
  }

  get city() {
    return this.name;
  }
}

class Schema {
  constructor(fields, Entity) {
    this.fields = fields;
    this.Entity = Entity;
  }

  format(dataset, cells) {
    const record = {};
    for (const { index, name, type } of this.fields) {
      const value = cells[index];
      if (value) {
        record[name] = type === 'number' ? parseInt(value) : value;
      }
    }
    return new this.Entity(dataset, record);
  }

  render(dataset) {
    const output = [];
    for (const record of dataset.records) {
      const row = [];
      for (const { index, name, type, size } of this.fields) {
        const value = record[name];
        const line = type === 'number' ? value.toString() : '  ' + value;
        row.push(index ? line.padStart(size) : line.padEnd(size));
      }
      output.push(row.join(''));
    }
    return output.join('\n');
  }
}

class Dataset {
  constructor(data, schema) {
    this.records = [];
    this.schema = schema;
    const lines = data.trim().split('\n').slice(1);
    for (const line of lines) {
      const cells = line.trim().split(',');
      const record = schema.format(this, cells);
      this.records.push(record);
    }
    this.records.sort((a, b) => b.density - a.density);
  }

  getRelativeDensity(density) {
    const maxDensity = this.records[0].density;
    return Math.round((density * 100) / maxDensity);
  }

  render() {
    return this.schema.render(this);
  }
}

const formatter = new Schema(schema, City);
const dataset = new Dataset(data, formatter);
const output = dataset.render();
console.log(output);
