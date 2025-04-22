//Importing function from dhHelper
import { getUsers, saveUsers } from "../db/dbHelper";
import { User } from '../interfaces/User';
import inquirer from "inquirer";

export async function userDelete({ id }: { id: string }): Promise<void> {
    try {
        const users: User[] = await getUsers();
        //Searches to find the matching ID of the user
        const userId = users.findIndex((u) => u.id.toString() === id.toString());

        if (userId === -1) {
            console.log(`No user found with this ID: ${id}`);
            return;
        }
        //Inquiry library for user confirmation
        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: `Are you sure you want to delete ${users[userId].fname} ${users[userId].lname} (ID: ${id})?`,
                default: false,
            },
        ]);

        if (confirm) {
            //Removing th user from the list using splice
            const deletedUser = users.splice(userId, 1)[0];
            await saveUsers(users);
            console.log(
                `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
            );
        } else {
            console.log("\n Deletion cancelled");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error updating user:", error.message);
        } else {
            console.error("An unknown error occurred.");
        }
    }
};
