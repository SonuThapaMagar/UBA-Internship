import { User, UserOptions } from '../types/User'
import { userService } from "../services/userService";

export async function userList(options: UserOptions): Promise<void> {
  try {
    const users: User[] = await userService.getUsers(options);
    if (users.length === 0) {
      console.log('No users found.');
      return;
    }
    console.log("Users:");
    users.forEach((user) => {
      console.log(`ID: ${user.id}, Name: ${user.fname} ${user.lname}`);
    });
  } catch (error) {
    console.error('Error reading users:', error instanceof Error ? error.message : 'An unknown error occurred.');
  }
};
