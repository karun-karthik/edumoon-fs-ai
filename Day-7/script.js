const salary = 20000;

const myObject = {
    name: "John",
    age: 30,
    isActive: true,
    hobbies: ["reading", "gaming"],
    total_salary: salary
}

const myObject2 = {
    name: "Duo",
    age: 30,
    isActive: false,
    hobbies: ["reading", "gaming"],
    "full name" : "John duo"
}

console.log(myObject)

// console.log(myObject.name)
// console.log(myObject["name"])
// console.log(myObject.age)

// console.log(myObject2["full name"])

const targetObject = { myObject, myObject2 }; // short hand operator 
// console.log(targetObject)

const target2 = { ...myObject, name: "Random Name" };
console.log(target2)

const { name, hobbies } = myObject2;

console.log(name, hobbies)
console.log(myObject2)

function greet() {
    console.log("Hello world")
}

myObject.sayGreet = greet;
myObject["sayGreetings"] = greet;

myObject.sayGreet()

console.log(typeof target2)
console.log(typeof 1)

localStorage.setItem("name", "UserName")
localStorage.setItem("someKey", "target2")
const value = localStorage.getItem("someKey")
localStorage.length
localStorage.removeItem("someKey")
localStorage.clear()

localStorage.setItem("object_key", myObject) // [Object object]
console.log(localStorage.getItem("object_key"))

localStorage.setItem("another_key", JSON.stringify(myObject))
const anotherObj = localStorage.getItem("another_key");
console.log(anotherObj)
console.log(JSON.parse(anotherObj))