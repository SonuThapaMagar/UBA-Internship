import { createUser } from "../services/userService";
import { UserCreate } from '../types/User'

export async function userCreate(options: UserCreate): Promise<void> {

  const newUser = await createUser(options);
  console.log(`User created successfully! ID: ${newUser.id}`);
}