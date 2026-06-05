let firstDiv = document.getElementById("hello")
console.log(firstDiv)

let secondDiv = document.getElementsByClassName("hello-class");
console.log(secondDiv)

// query selector
let third = document.querySelector("#hello")
console.log(third)

let fourth = document.querySelector(".hello-class")
console.log(fourth)

let fifth = document.querySelectorAll(".hello-class")
console.log(fifth)

const button = document.getElementById("myButton")
console.log(button)

function printName() {
    console.log("Print user name")
}

// printName()

// link button with printName function
// addEventListener => to link a behaviour to a event
button.addEventListener("click", (event) => {
    third.classList.add("c")
    console.log(third.classList)
});
// button.addEventListener("click", printName)

// anonymous function
// button.addEventListener("click", () => {
//     console.log("Clicked");
//     const inputField = document.getElementById("myInput")
//     alert("Input value: " + inputField.value);
// })

// const inputField = document.getElementById("myInput")
// inputField.addEventListener("change", function(){
//     console.log(inputField.value)
// })

const arr = []
console.log(arr)
console.log(arr.length)

arr.push("Hello")
arr.push("World")
arr.push(1)
arr.push(55.5)
arr.push(false)
arr.push({"firstName": "User"})

console.log(arr)

// index = element's position - 1

for (let idx = 0; idx < arr.length; idx++) {
    console.log(arr[idx])
}


console.log("Using forEach")

console.log(arr);
console.log(arr.forEach((ele, idx) => {
    if (idx == 1) {
        arr[idx] = "TEST";
    }
}))

console.log("After updating", arr)


const data = [1, 2, 3, 4, 5];
// data.forEach((ele, idx) => {
//     data[idx] = ele * 2
// })
// console.log(data)

console.log("Map:")
const dataMap = data.map((ele) => {
    return ele * 2
})

const multiplyBy2 = ele => ele * 2
console.log(data.map(multiplyBy2))

function multiplyBy3 (ele) {
    return ele * 3
}

console.log(data.map(multiplyBy3))

// console.log(data)
// console.log(dataMap)

function isOdd(ele) {
    return ele % 2 != 0
}


const filterData = data.filter(isOdd)
console.log(filterData)

const findValue1 = data.find(ele => ele == 6)
console.log(findValue1)

const findValue = data.findIndex(ele => ele == 4)
console.log(findValue)

// Complex operations

const myObject = {
    name: "John",
    age: 30,
    isActive: true,
    hobbies: ["reading", "gaming"]
}

const myObject2 = {
    name: "Duo",
    age: 30,
    isActive: false,
    hobbies: ["reading", "gaming"]
}

console.log(myObject)
console.log(myObject.name)
// console.log(myObject["name"])
console.log(myObject.age)
console.log(myObject.hobbies)

// const dataArray = []
// dataArray.push(myObject)
// dataArray.push("abc")
// console.log(dataArray)
// dataArray.pop()
// console.log(dataArray)

const dataArray = [myObject, myObject2]
console.log(dataArray)

console.log(dataArray.map(function(item) {
    return item.name
}))

console.log(dataArray.filter(function(item) {
    return item.isActive
}))

const temp = dataArray.filter((item) => item.isActive);
const temp2 = temp.map(item => item.name);
console.log(temp)
console.log(temp2)

console.log(dataArray.filter((item) => item.isActive).map(item => item.name))