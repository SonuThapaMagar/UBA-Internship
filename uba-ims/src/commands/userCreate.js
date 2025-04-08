const { getUsers, saveUsers, generateID } = require("../helpers/dbHelper");

module.exports = async (options) => {
  try {
    const users = await getUsers();
    const newUser = {
      id: generateID(),
      fname: options.fname,
      lname: options.lname,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await saveUsers(users);
    console.log(`User created successfully! ID: ${newUser.id}`);
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
};
