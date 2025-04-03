// Importing all utility functions using CommonJS require()
const chalk = require('chalk').default; 
const { randomNumber, celciusToFahrenheit, add, subtract } = require("./utils.cjs");

console.log(`Random Number: ${randomNumber()}`);
console.log(`32°C to Fahrenheit: ${celciusToFahrenheit(32)}°F`);
console.log(`Add: ${add(5, 3)}`);
console.log(`Subtract: ${subtract(5, 3)}`);

console.log(chalk.blue("Hello world printed in blue"));
