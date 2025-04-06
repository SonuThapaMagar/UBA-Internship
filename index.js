const inquirer = require("inquirer").default;

inquirer
  .prompt([
    {
      name: "faveBird",
      message: "What is your favorite bird?",
    },
  ])
  .then((answers) => {
    console.info("Answer:", answers.faveBird);   
  });
