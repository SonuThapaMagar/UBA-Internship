function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
  
  function celciusToFahrenheit(celcius) {
    return (celcius * 9) / 5 + 32;
  }
  
  function add(a, b) {
    return a + b;
  }
  
  function subtract(a, b) {
    return a - b;
  }
  
  // Export all functions
  module.exports = {
    randomNumber,
    celciusToFahrenheit,
    add,
    subtract
  };