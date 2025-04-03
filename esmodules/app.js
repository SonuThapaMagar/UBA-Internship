import { 
    randomNumber, 
    celciusToFahrenheit,
    add,
    subtract 
  } from './utils.js';
  
  console.log(`Random Number: ${randomNumber()}`);
  console.log(`32°C to Fahrenheit: ${celciusToFahrenheit(32)}°F`);
  console.log(`Add: ${add(5, 3)}`);
  console.log(`Subtract: ${subtract(5, 3)}`);