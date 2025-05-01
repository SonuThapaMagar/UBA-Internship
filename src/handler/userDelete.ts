// Importing functions from dbHelper
import { userService } from "../services/userService";
import { User } from '../types/User';
import inquirer from "inquirer";

type UserDeleteInput = { id: string };

export async function userDelete({ id }: UserDeleteInput): Promise<void> {
  const deletedUser = await userService.deleteUser(id);
  console.log(
    `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
  );
};
