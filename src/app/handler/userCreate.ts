import { UserService } from '../services/userService';
import { UserCreate } from '../../types/User';

export async function userCreate(options: UserCreate): Promise<void> {
  const userService = new UserService();
  try {
    const newUser = await userService.createUser(options);
    console.log(`User created successfully! ID: ${newUser.id}`);
  } catch (error) {
    console.error('Error creating user:', error instanceof Error ? error.message : 'An unknown error occurred.');
  }
}