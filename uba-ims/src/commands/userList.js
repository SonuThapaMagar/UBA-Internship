const { getUsers } = require("../helpers/dbHelper");

module.exports = async (options) => {
  try {
    const users = await getUsers();
    let filteredUsers = users;

    if (options.fname || options.lname) {
      filteredUsers = users.filter((user) => {
        return (
          (!options.fname ||
            user.fname.toLowerCase().includes(options.fname.toLowerCase())) &&
          (!options.lname ||
            user.lname.toLowerCase().includes(options.lname.toLowerCase()))
        );
      });
    }

    if (filteredUsers.length === 0) {
      console.log("No users found.");
      return;
    }
    console.log("Users:");
    filteredUsers.forEach((user) => {
      console.log(
        `ID: ${user.id}, Name: ${user.fname} ${user.lname}, Created: ${user.createdAt}`
      );
    });
  } catch (error) {
    console.error("Error reading users:", error.message);
  }
};
