'use strict';
//has_vs_in_vs_hasOwnProperty_for_set
const set12 = new Set([
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
const ob = Object.fromEntries(set12.entries());

function hasInSet(ob) {
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
    Object.prototype.hasOwnProperty.call(ob, 'noExist');
    Object.prototype.hasOwnProperty.call(ob, 'css2');
    Object.prototype.hasOwnProperty.call(ob, 'png');
  }
}
function forObjHas(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    ob.hasOwnProperty('css');
    ob.hasOwnProperty('xls');
    ob.hasOwnProperty('ico');
    ob.hasOwnProperty('noExist');
    ob.hasOwnProperty('css2');
    ob.hasOwnProperty('png');
  }
}
function forObjProp(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    ob['css'];
    ob['xls'];
    ob['ico'];
    ob['noExist'];
    ob['css2'];
    ob['png'];
  }
}
function forObjOptChain(ob) {
  for (let j = 0; j < 1_000_000; j++) {
    ob?.css;
    ob?.xls;
    ob?.ico;
    ob?.noExist;
    ob?.css2;
    ob?.png;
  }
}
for (let c = 0; c < 5; c++) {
  console.time('in');
  hasInSet(ob);
  console.timeEnd('in'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('protoHasOwnProperty');
  forObjProtoHas(ob);
  console.timeEnd('protoHasOwnProperty'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('hasOwnProperty');
  forObjHas(ob);
  console.timeEnd('hasOwnProperty'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('objProp');
  forObjProp(ob);
  console.timeEnd('objProp'); // ~5000ms
}
for (let c = 0; c < 5; c++) {
  console.time('objOptionalChainingProp');
  forObjOptChain(ob);
  console.timeEnd('objOptionalChainingProp'); // ~5000ms
}
