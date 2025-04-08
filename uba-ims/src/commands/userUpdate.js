const { getUsers, saveUsers } = require("../helpers/dbHelper");

module.exports = async (id, options) => {
  try {
    const users = await getUsers();
    const userId = users.findIndex((user) => user.id === id);
    if (userId === -1) {
      console.log("User not found with ID:", id);
      return;
    }

    const updatedUser = { ...users[userId] };
    if (options.fname) updatedUser.fname = options.fname;
    if (options.lname) updatedUser.lname = options.lname;

    users[userId] = updatedUser;
    await saveUsers(users);
    console.log(`User updated successfully! ID: ${id}`);
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};
