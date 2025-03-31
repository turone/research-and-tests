'use strict';
//has_vs_in_vs_hasOwnProperty_for_set
const arr = new Set([
  'css',
  'jpg',
  'gif',
  'png',
  'svg',
  'zip',
  'rar',
  'doc',
  'xls',
  'js',
  'tif',
  'tiff',
  'docx',
  'xlsx',
  'ico',
]);

// const ob = Object.fromEntries(arr.entries());

const ob = {
  css: 'css',
  jpg: 'jpg',
  gif: 'gif',
  png: 'png',
  svg: 'svg',
  zip: 'zip',
  rar: 'rar',
  doc: 'doc',
  xls: 'xls',
  js: 'js',
  tif: 'tif',
  tiff: 'tiff',
  docx: 'docx',
  xlsx: 'xlsx',
  ico: 'ico',
};

function hasInSet(arr) {
  for (let j = 0; j < 1_000_000; j++) {
    arr.has('css');
    arr.has('xls');
    arr.has('ico');
    arr.has('xlsx');
    arr.has('css2');
    arr.has('png');
  }
}
function keyIn(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    'css' in ob;
    'xls' in ob;
    'ico' in ob;
    'xlsx' in ob;
    'css2' in ob;
    'png' in ob;
  }
}
function forObjProtoHas(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    Object.prototype.hasOwnProperty.call(ob, 'css');
    Object.prototype.hasOwnProperty.call(ob, 'xls');
    Object.prototype.hasOwnProperty.call(ob, 'ico');
    Object.prototype.hasOwnProperty.call(ob, 'xlsx');
    Object.prototype.hasOwnProperty.call(ob, 'css2');
    Object.prototype.hasOwnProperty.call(ob, 'png');
  }
}
function forObjHas(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    ob.hasOwnProperty('css');
    ob.hasOwnProperty('xls');
    ob.hasOwnProperty('ico');
    ob.hasOwnProperty('xlsx');
    ob.hasOwnProperty('css2');
    ob.hasOwnProperty('png');
  }
}

for (let c = 0; c < 5; c++) {
  console.time('has');
  hasInSet(arr);
  console.timeEnd('has'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('in');
  keyIn(ob);
  console.timeEnd('in'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('hasOwnPropertyProto');
  forObjProtoHas(ob);
  console.timeEnd('hasOwnPropertyProto'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('hasOwnProperty');
  forObjHas(ob);
  console.timeEnd('hasOwnProperty'); // ~5000ms
}
/*for (let c = 0; c < 5; c++) {
  console.time('has in set arr+arr2');
  myFor4(arr);
  console.timeEnd('has in set arr+arr2'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('has in set arr+arr2+arr2');
  myFor5(arr);
  console.timeEnd('has in set arr+arr2+arr2'); // ~5000ms
}
//console.log(res);*/
// console.log(arr, ob);
