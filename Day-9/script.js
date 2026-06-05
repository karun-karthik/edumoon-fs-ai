// // Promise example

// // fetch user data is a mock API ~ test api that always returns hardcoded response
// const fetchUserData = (userId, time) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // return the user data.
//             const userData = {
//                 id: userId,
//                 name: "Test user",
//                 age: 30
//             }

//             if (userId) {
//                 resolve(userData);
//             } else {
//                 reject({ message: "UserId is not provided"});
//             }
//         }, time)
//     });
// } // being executed asynchronously

// console.log("Before fetchUserData API call");
// let isLoading = true;
// fetchUserData(undefined, 5000)
// .then(userData => console.log("User Data: ", userData)) // success
// .catch(error => console.error(error))                   // failure
// .finally(() => {
//     isLoading = false;
//     console.log("Execution completed")
// });

// console.log("After fetchUserData API call")

// // custom class ~ specific to our usecases
// class ValidationError extends Error {
//     constructor(message) {
//         super(message);
//         this.name
//     }
// }

// function processData(data) {
//     if (!data || typeof data != 'object') {
//         throw new ValidationError("Invalid Data is provided")
//     }
//     console.log("Data processed successfully: ", data);
// }

// try {
//     processData({"name": "Test"});
//     processData(null)
// } catch(error) {
//     if (error instanceof ValidationError) {
//         console.error("Validation Error: ", error)
//     } else {
//         console.error("Unexpected error occured", error)
//     }
// }


async function fetchData() {
    try {
        const response = await fetch("https://wttr.in/Hyderabad?format=j1")
        console.log(response)

        if (!response.ok) {
            throw new Error("API failed")
        }

        const data = await response.json()

        // 'axios' => API call
        console.log("Data fetched successfully",  data)
        return data;
    } catch(err) {
        console.warn("There has been an exception")
        return []
    } finally {
        console.log("Completed")
    }
}


console.log("Fetching data..")

console.log(fetchData())