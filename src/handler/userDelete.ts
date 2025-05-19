import { UserService } from '../services/userService';

type UserDeleteInput = { id: string };

export async function userDelete({ id }: UserDeleteInput): Promise<void> {
      const userService = new UserService(); 
  
  try {
    const deletedUser = await userService.deleteUser(id);
    console.log(
      `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`
    );
  } catch (error) {
    console.error('Error deleting user:', error instanceof Error ? error.message : 'An unknown error occurred.');
  }
}