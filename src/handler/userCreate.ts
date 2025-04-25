//Importing function from dbHelper
import { getUsers, saveUsers, generateID } from "../db/dbHelper";
import { User, UserCreate } from '../types/User'

export async function userCreate(options: UserCreate): Promise<void> {
  const users: User[] = await getUsers();

  const newUser: User = {
    id: generateID(),
    fname: options.fname,
    lname: options.lname,
  };
  users.push(newUser);
  await saveUsers(users);
  console.log(`User created successfully! ID: ${newUser.id}`);

}