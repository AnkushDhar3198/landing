let arr1 = [50, 41, 98, 33, 11, 65, 78, 97, 16]
console.log(arr1.filter((num) => num % 2 === 0));

let arr2 = [50, 41, 98, 33, 11, 65, 78, 97, 16]
arr2.map((num) => num*num)
console.log(arr2);

let arr3 = [50, 41, 98, 33, 11, 65, 78, 97, 16]
console.log(arr3.reduce((acc, curr) => acc+curr));

//Array.of(...elements)
console.log(Array.of(3));
console.log(Array(3));
console.log(Array.of(1, 2, 3));

//arr.at(index)
let a = [10, 20, 30]
console.log(a.at(0));
console.log(a.at(-1));

//arr.concat(...values)
let b = [1, 2, 3]
let num = 50
let c = [69, 88, 96]

console.log(b.concat([9, 10, 11]));
console.log(c.concat(b.concat(c)));
console.log([77, 78, 79].concat(num).concat(c.concat(b)));
console.log([1].concat(2, [3], [[4]]));

//arr.slice(start?, end?)
let d = [50, 41, 98, 33, 11, 65, 78, 97, 16]

// Variations of slice() examples
const arr = [10, 20, 30, 40, 50];

console.log(arr.slice());          // [10, 20, 30, 40, 50] (full shallow copy)
console.log(arr.slice(2));         // [30, 40, 50] (from index 2 to end)
console.log(arr.slice(1, 4));      // [20, 30, 40] (start inclusive, end exclusive)
console.log(arr.slice(0, 1));      // [10] (first element only)
console.log(arr.slice(-2));        // [40, 50] (last 2 elements)
console.log(arr.slice(-4, -1));    // [20, 30, 40] (negative start/end)
console.log(arr.slice(3, 3));      // [] (same start and end -> empty)
console.log(arr.slice(4, 2));      // [] (start > end -> empty)
console.log(arr.slice(100));       // [] (start out of range)
console.log(arr.slice(-100, 2));   // [10, 20] (very negative start treated as 0)

console.log(arr);                  // original unchanged [10, 20, 30, 40, 50]

// With strings
const text = "JavaScript";
console.log(text.slice(0, 4));     // "Java"
console.log(text.slice(-6));       // "Script"

// Shallow copy behavior with objects
const users = [{ name: "A" }, { name: "B" }];
const copy = users.slice();
copy[0].name = "Changed";
console.log(users[0].name);        // "Changed" (object reference shared)
