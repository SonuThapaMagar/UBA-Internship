import { getUsers } from "../db/dbHelper";
import { User, UserOptions } from '../types/User'

export async function userList(options: UserOptions): Promise<void> {
  try {
    const users: User[] = await getUsers();
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
        `ID: ${user.id}, Name: ${user.fname} ${user.lname}`
      );
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error reading users:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
};
