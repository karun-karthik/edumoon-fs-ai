console.log("Hey user!")
console.log("Hey!")
console.warn("This is a warning")
console.error("This is an error")
console.info("This is an info")
console.debug("This is a debug")

// Variables: let, const, var
/*
var - is function scoped & redeclared
let - is block scoped & can be updated but not re-declared
const - block scoped & cannot be updated or re-declared
 */

var a = 5;
console.log(a);
var a = 6;
console.log(a);

let b = 10;
console.log(b);
b = 100; // throws error if we use let b = 100;
console.log(b);

const c = 100;
console.log(c);
// c = 20; this line throws an error Uncaught TypeError: Assignment to constant variable.

// Datatypes
let number = 10;
console.log(number);
let isStudent = true;
console.log(isStudent);
let hobby = ["reading", "coding"] // array
console.log(hobby);
let person = {
    "firstName" : "Jane",
    "lastName" : "Doe"
}
console.log(person);
let nothing = null;
console.log(nothing);
let notDefined;
console.log(notDefined);

// Operators

let sum = 4 + 7;
let prod = 4 * 9;
let isEqual = sum == 11
let i = 5
i = i + 10
let true1 = 5 == 5
let true2 = 5 == "5"
let true3 = 5 === "5"

let age = 18
if (age < 18) {
    console.log("Minor");
} else if (age >= 18 && age < 65) {
    console.log("Adult");
} else {
    console.log("Senior")
}

// debugger

let grade = "B";
switch (grade) {
    case "A": console.log("Excellent"); break;
    case "B": console.log("Good"); break;
    case "C": console.log("Avg"); break;
    default: console.log("Default case");
}

// loops

let k = 0;
while (k < 10) {
    console.log(++k);
}

console.log("Do while loop")

let j = 0;
do {
    console.log(j)
} while (j > 1)


console.log("For loop")
for (let i = 0; i < 5; i++) {
    console.log("For loop iteration: ", i);
}


console.log("Functions")

function sayHello() {
    console.log("Hello");
}

sayHello();
sayHello();
sayHello();
sayHello();
sayHello();

// void functions
function sayHelloParameter(name) {
    console.log("Hello " + name);
}

sayHelloParameter("EduMoon")
sayHelloParameter("KK")

// return functions

function addNumbers(a, b) {
    return a + b
}

let sumValue = addNumbers(1, 2);
console.log(sumValue)

const add = (a, b) => a + b; // lamda functions:
console.log(add(10, 20))


const helloClass = document