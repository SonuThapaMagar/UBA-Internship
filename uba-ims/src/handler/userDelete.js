// //Importing function from dhHelper
// const { getUsers, saveUsers } = require("../helpers/dbHelper");
// //Library for inquiry
// const inquirer = require("inquirer");

// module.exports = async ({ id }) => {
//   try {
//     const users = await getUsers();
//     //Searches to find the matching ID of the user
//     const userId = users.findIndex((u) => u.id.toString() === id.toString());

//     if (userId === -1) {
//       console.log(`No user found with this ID: ${options.id}`);
//       return;
//     }
//     //Inquiry library for user confirmation
//     const { confirm } = await inquirer.prompt([
//       {
//         type: "confirm",
//         name: "confirm",
//         message: `Are you sure you want to delete ${users[userId].fname} ${users[userId].lname} (ID: ${id})?`,
//         default: false,
//       },
//     ]);

//     if (confirm) {
//       //Removing th user from the list using splice
//       const deletedUser = users.splice(userId, 1)[0];
//       await saveUsers(users);
//       console.log(
//         `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
//       );
//     } else {
//       console.log("\n Deletion cancelled");
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error.message);
//   }
// };
