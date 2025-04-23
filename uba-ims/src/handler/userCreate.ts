  //Importing function from dbHelper
  import { getUsers, saveUsers, generateID } from "../db/dbHelper";
  import { User } from '../interfaces/User'

  export async function userCreate(options: { fname: string; lname: string }): Promise<void> {
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