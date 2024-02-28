'use strict';
let arr = new Array(100).fill(0).map((e, i) => i);
let res = 0;

function myFor(arr) {
  let temp = 0;
  for (let index of arr) {
    let tempSum = 0;
    for (let j = 0; j < 10_000_000; j++) {
      tempSum += arr[index];
    }
    temp += tempSum;
  }
  res += temp;
}

for (let c = 0; c < 5; c++) {
  console.time('for');
  myFor(arr);
  console.timeEnd('for'); // ~490ms
}

console.log(res);
