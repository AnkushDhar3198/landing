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
