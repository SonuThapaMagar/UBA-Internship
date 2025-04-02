// const {randomNumber,celciusToFahrenheit}=require('./utils')

// console.log(`Random Number: ${randomNumber()}`);
// console.log(`Celsius to Fahrenheit: ${celciusToFahrenheit(32)}`);

import getPosts, { getPostsLength } from "./postController.js";
console.log(getPosts());
console.log(`Posts Length: ${getPostsLength()}`);
