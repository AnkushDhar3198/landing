let arr = [10, 20, 30]
console.log(arr);
arr.push(40)
console.log(arr);
arr.push(50)
console.log(arr);
arr.pop()
console.log(arr);

arr.unshift(0)
console.log(arr);
arr.shift()
console.log(arr);

arr.push(30)
console.log(arr.indexOf(30));
console.log(arr.lastIndexOf(30));

console.log(arr.toString());
console.log(arr.join(" "));


//splice(start, del_count, ...items) : modifies the original array and returns a new array of deleted elements
let nums = [5, 7, 1, 4, 3, 6, 8]
let spliced = nums.splice(2, 4, 18, 45, 17)
console.log(spliced);
console.log(nums);

let str = "this is js" // reverse w/o using loop

let strArr = str.split(" ")
console.log(strArr.reverse().join(" "))

let newArr = str.split("")
console.log(newArr.reverse().join(""))

// sort() : sorts lexicographically -> does not sort correctly always
let vals = [100, 2, 300, 200, 3, 5, 9, 500, "ABC", 900, "abc"]
vals.sort()
console.log(vals); // [ 100, 2, 200, 3, 300, 5, 500, 9, 900, 'ABC', 'abc' ]

let eles = [100, 2, 300, 200, 3, 5, 9, 500, "ABC", 900, "abc"]
eles.sort((a, b) => a - b)
console.log(eles);

let items = [100, 2, 300, 200, 3, 5, 9, 500, "ABC", 900, "abc"]
items.sort((a, b) => b - a)
console.log(items);


let s = "elbow"
let t = "below"

console.log(s.split("").sort().join("") === t.split("").sort().join("") ? "anagram" : "not anagram");

// fill(val, start, end)
// concat() : returns new array

// copyWithin(target, start, end) : modifies original array : copy the eles of the same array within the array at the specific index
let a = [10, 20, 30, 40, 50]
a.copyWithin(2, 0, 2)

console.log(a); // [ 10, 20, 10, 20, 50 ]

// flat() : returns new array : can accept numbers or "Infinity" -> number represents the number of layers i want to remove
let b = [10, 20, [30, 40, [50, 60]]]

console.log(b);
console.log(b.flat(1));
console.log(b.flat(2));
console.log(b.flat(Infinity));

let c = [7, 1, 5, 4, 3, 2, 6]

console.log(c.reduce((a, b) => a + b));
console.log(c.reduce((a, b) => a * b));
console.log(c.map(ele => ele**2));
c.forEach(ele => console.log(ele))
console.log(c.filter(ele => ele%2 == 1));

const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key); // a, b
}

const d = [10, 20, 30];
for (const value of d) {
  console.log(value); // 10, 20, 30
}

let e = [11, 13, 15]
console.log(e.some(ele => {})); // callback function will return undefined and it is a falsey value : falsey values : 0, 0n, undefined, null, NaN, false, ''

let f = [0, 0n, null, NaN, 10]
console.log(f.find(ele => ele));

let g = [10, 11, 12, 13, 14]
console.log(g.filter((ele, i) => i)); // first i = 0 => falsey value => 10 will not be returned // [ 11, 12, 13, 14 ]