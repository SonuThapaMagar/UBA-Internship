const fs = require("fs-extra");
const path = require("path");

const dbPath = path.join(__dirname, "../data/users.json");

//DB Check
async function initDB() {
  try {
    //Creating a file if it doesn't exists
    await fs.ensureFile(dbPath);
    const currentData = await fs.readFile(dbPath, "utf8");
    if (currentData.trim() === "") {
      // Initialize with empty array
      await fs.writeJson(dbPath, []);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

//Listing all users
async function getUsers() {
  await initDB();
  return await fs.readJson(dbPath);
}

//Saving users
async function saveUsers(users) {
  await initDB();
  return await fs.writeJson(dbPath, users);
}

//Generating ID
function generateID() {
  return Date.now().toString();
}

module.exports = { getUsers, saveUsers, generateID };
