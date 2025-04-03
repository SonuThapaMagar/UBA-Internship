function randomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function celciusToFahrenheit(celcius) {
  return (celcius * 9) / 5 + 32;
}

//Common JS
// module.exports = { randomNumber, celciusToFahrenheit };


//ES Modules
export const add=(a,b)=>a+b;
export const subtract = (a, b) => a - b;
