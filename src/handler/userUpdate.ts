import { UserOptions } from "../types/User";
import { UserService } from '../services/userService';

export async function userUpdate(id: string, options: UserOptions): Promise<void> {
  const userService = new UserService();

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