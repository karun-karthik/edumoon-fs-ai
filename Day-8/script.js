var name = "Edumoon";
console.log(`Hello ${name}`);
console.log("Hello " + name);

function addNumbers(x, y) {
    return x + y
}

console.log(addNumbers(5, 10))

const addNumbers1 = (x, y) => x + y;

console.log(addNumbers1(5, 10))

const addNumbers2 = (x, y, z) => {
    let s1 = x + y;
    let s2 = s1 + z;
    return s2;
}

console.log(addNumbers2(1,2,3))

// map, filter, find, forEach, findIndex
// objects : . ["key"]
// ...
//  const { key1, key2 } = someObject;


const variableKey = "testabc";

const p1 = {
    "name": "Edumoon",
    [variableKey]: "some variable value",
    variableKey
}

console.log(p1)

const company = {
    "name" : "Edumoon",
    "address": {
        street: "street 123",
        city: "city abc",
        country: "IN"
    },
    "contact": {
        "phone": 123456789
    }
}

console.log(company.address.street)
console.log(company.address.zipcode) // undefined and no error
// console.log(company.contact.phone)
console.log(company?.contact?.phone || 'Not Available') // optional chaining


const callBackFn = (abcd) => {
    abcd();
}

const hi = () => console.log("Hi");
const bye = () => console.log("Bye");

const a = 50

callBackFn(a > 10 ? hi : bye); // addEventListener("event", callBack)

// setTimeout and setInterval

// console.log(Date.now().toLocaleString())
// setTimeout(() => {
//     console.log(Date.now().toLocaleString())
// }, 10000)


// setInterval(() => {
//     console.log(Date.now())
// }, 1000)

// const company1 = {
//         "name" : "Edumoon",
//         "address": {
//             street: "street 123",
//             city: "city abc",
//             country: "IN"
//         }
//     }
// console.log(company1.contact.phone)

try {
    const company = {
        "name" : "Edumoon",
        "address": {
            street: "street 123",
            city: "city abc",
            country: "IN"
        }
    }
    console.log(company.contact.phone)
} catch (error) {
    console.error(error)
}

console.log("After error")