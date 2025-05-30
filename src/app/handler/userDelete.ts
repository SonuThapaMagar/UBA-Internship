import { UserService } from '../services/userService';

type UserDeleteInput = { id: string };

export async function userDelete({ id }: UserDeleteInput): Promise<void> {
  const userService = new UserService();

  try {
    await userService.deleteUser(id);
    console.log(`Successfully deleted user with ID: ${id}`);
  } catch (error) {
    console.error('Error deleting user:', error instanceof Error ? error.message : 'An unknown error occurred.');
  }
}