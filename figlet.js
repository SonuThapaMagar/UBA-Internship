const figlet = require("figlet");
figlet("Hello", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

// Using async/await
(async () => {
    try {
      const result = await figlet.text("Boo!", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      });
      console.log(result);
    } catch (error) {
      console.log("Something went wrong...");
      console.dir(error);
    }
  })();

// figlet.text(
//   "Boo!",
//   {
//     font: "Ghost",
//     horizontalLayout: "default",
//     verticalLayout: "default",
//     width: 80,
//     whitespaceBreak: true,
//   },
//   function (err, data) {
//     if (err) {
//       console.log("Something went wrong...");
//       console.dir(err);
//       return;
//     }
//     console.log(data);
//   }
// );
