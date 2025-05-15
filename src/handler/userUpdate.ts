import { UserOptions } from "../types/User";
import { userService } from '../services/userService'

export async function userUpdate(id: string, options: UserOptions): Promise<void> {
  try {
    const updatedUser = await userService.updateUser(id, options);
    console.log(`User updated successfully! ID: ${updatedUser.id}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}
