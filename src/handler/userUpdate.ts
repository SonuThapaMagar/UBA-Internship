import { User, UserOptions } from "../types/User";
import { updateUser } from '../services/userService'

export async function userUpdate(id: string, options: UserOptions): Promise<void> {
  try {
    const updatedUser = await updateUser(id, options);
    console.log(`User updated successfully! ID: ${id}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}
