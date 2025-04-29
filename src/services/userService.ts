import { getUsers as dbGetUsers, saveUsers, generateID } from "../db/dbHelper";
import { User, UserCreate, UserOptions } from '../types/User';

export async function getUsers(options: UserOptions = {}): Promise<User[]> {
    const users = await dbGetUsers();
    if (options.fname || options.lname) {
        return users.filter((user) => {
            return (
                (!options.fname ||
                    user.fname.toLowerCase().includes(options.fname.toLowerCase())) &&
                (!options.lname ||
                    user.lname.toLowerCase().includes(options.lname.toLowerCase()))
            );
        });
    }
    return users;
}

export async function getUserById(id: string): Promise<User> {
    const users = await dbGetUsers();
    const user = users.find(u => String(u.id) === String(id));

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

export async function createUser(userData: UserCreate): Promise<User> {
    const users = await dbGetUsers();
    const newUser: User = {
        id: generateID(),
        fname: userData.fname,
        lname: userData.lname,
    };

    users.push(newUser);
    await saveUsers(users);
    return newUser;
}

export async function updateUser(id: string, userData: UserOptions): Promise<User> {
    const users = await dbGetUsers();
    const userId = users.findIndex(user => String(user.id) === String(id));
    if (userId === -1) {
        throw new Error('User not found');
    }

    const updatedUser = {
        ...users[userId],
        ...userData,
        id: users[userId].id
    };

    users[userId] = updatedUser;
    await saveUsers(users);
    return updatedUser;
}

export async function deleteUser(id: string): Promise<User> {

    const users = await dbGetUsers();
    const userId = users.findIndex(u => u.id.toString() === id.toString());
    if (userId === -1) {
        throw new Error(`User with ID ${id} not found`);
    }

    const deletedUser = users.splice(userId, 1)[0];
    await saveUsers(users);
    return deletedUser;
}