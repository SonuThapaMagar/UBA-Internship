import fs from "fs-extra";
import path from "path";
//Custom interface
import { User } from "../types/User";

//JSON db path
const dbPath = path.join(__dirname, "../data/users.json");

//DB Check
export async function initDB():Promise<void> {
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
export async function getUsers():Promise<User[]> {
  await initDB();
  return await fs.readJson(dbPath);
}

//Saving users
export async function saveUsers(users:User[]):Promise<void> {
  await initDB();
  return await fs.writeJson(dbPath, users, { spaces: 2 });
}

//Generating ID
export function generateID():string {
  return Date.now().toString();
}