// Importing functions from dbHelper
import { getUsers, saveUsers } from "../db/dbHelper";
import { deleteUser } from "../services/userService";
import { User } from '../types/User';
import inquirer from "inquirer";

type UserDeleteInput = { id: string };

export async function userDelete({ id }: UserDeleteInput): Promise<void> {
  const deletedUser = await deleteUser(id);
  console.log(
    `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
  );
  // try {
  //   const users: User[] = await getUsers();
  //   // Searches to find the matching ID of the user
  //   const userId = users.findIndex((u) => u.id.toString() === id.toString());

  //   if (userId === -1) {
  //     console.log(`No user found with this ID: ${id}`);
  //     return;
  //   }

  //   // Inquiry library for user confirmation
  //   const { confirm } = await inquirer.prompt([
  //     {
  //       type: "confirm",
  //       name: "confirm",
  //       message: `Are you sure you want to delete ${users[userId].fname} ${users[userId].lname} (ID: ${id})?`,
  //       default: false,
  //     },
  //   ]);

  //   if (confirm) {
  //     // Removing the user from the list using splice
  //     const deletedUser = users.splice(userId, 1)[0];
  //     await saveUsers(users);
  //     console.log(
  //       `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
  //     );
  //   } else {
  //     console.log("\nDeletion cancelled");
  //   }
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.error("Error during user deletion:", error.message);
  //   } else {
  //     console.error("An unknown error occurred during user deletion.");
  //   }
  // }
};
