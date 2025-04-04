// // Callback hell
// setTimeout(() => {
//     console.log("Task 1 completed");
//     setTimeout(() => {
//         console.log("Task 2 completed");
//         setTimeout(() => {
//             console.log("Task 3 completed");
//         }, 1000);
//     }, 1000);
// }, 1000);

// function delay(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function runTasks() {
//   console.log("Task 1 completed");
//   await delay(1000);

//   console.log("Task 2 completed");
//   await delay(1000); // Waits for another second

//   console.log("Task 3 completed");
// }
// runTasks();

// //Creating a Promise
// const myPromise = new Promise((resolve, reject) => {
//   let success = true;

//   setTimeout(() => {
//     if (success) {
//       resolve("Promise resolved successfully!"); // Success case
//     } else {
//       reject("Promise rejected!"); // Failure case
//     }
//   }, 2000);
// });

// //Consuming the promise
// myPromise
//   .then((message) => {
//     console.log(message); // Runs if resolved
//   })
//   .catch((error) => {
//     console.error(error); // Runs if rejected
//   })
//   .finally(() => {
//     console.log("Promise execution finished."); // Runs in both cases
//   });

//callback example
// function orderPizza(callback) {
//   console.log("Ordering Pizza");

//   setTimeout(() => {
//     console.log("Pizza is ready");
//     // Calls the provided function after 2 seconds
//     callback();
//   }, 2000);
// }

// function eatPizza() {
//   console.log("Eating pizza");
// }
// // Call the function and pass 'eatPizza' as a callback
// orderPizza(eatPizza);

//Set Interval
setInterval(() => {
  const now = new Date();

  // Prints current time every second
  console.log(now.toLocaleTimeString());
}, 1000);
