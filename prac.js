let arr = [1, 2, 3, 2, 4, 1, 5]

let op = []

arr.forEach(ele => {
    if(!op.includes(ele)) {
        op.push(ele)
    }
})

console.log(op);

let names = ["Atul", "Pranavii", "Anurag", "Vishala", "Riteshi", "Abhinav"]
let vowels = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]

console.log(names.filter(ele => vowels.includes(ele.charAt(0))));

let nums = [10, 0, 12, 0, 1, 2, 0, 9]

nums.forEach((ele, i) => {
    if(ele == 0) {
        nums.splice(i, 1)
        nums.push(ele)
    }
})

console.log(nums);
