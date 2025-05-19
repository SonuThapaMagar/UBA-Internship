import { UserService } from '../services/userService';
import { UserCreate } from '../types/User';

export async function userCreate(options: UserCreate): Promise<void> {
  const userService = new UserService();
  const newUser = await userService.createUser(options);
  console.log(`User created successfully! ID: ${newUser.id}`);
}