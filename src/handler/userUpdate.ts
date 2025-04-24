import { getUsers, saveUsers } from "../db/dbHelper";
import { User } from "../interfaces/User";

export async function userUpdate(id: string, options: { fname?: string; lname?: string }): Promise<void> {

  try {
    const users: User[] = await getUsers();
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
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
};
