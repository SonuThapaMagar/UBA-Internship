import { Request, Response } from 'express';
import { getUsers, saveUsers, generateID } from "../db/dbHelper";
import { createUser } from '../services/userService'
import { User } from '../types/User';

//Create user
export class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    }

    //Get all user
    async userList(req: Request, res: Response): Promise<void> {

        const users = await getUsers();
        res.json(users);
    }

    //get user by id
    async getUserById(req: Request, res: Response): Promise<void> {

        const users = await getUsers();
        const user = users.find(u => String(u.id) === String(req.params.id));

        if (!user) {
            throw new Error('User not found');
        }

        res.json(user);
    }

    //update user
    async userUpdate(req: Request, res: Response): Promise<void> {

        const users: User[] = await getUsers();
        const userId = users.findIndex(user => String(user.id) === String(req.params.id));

        if (userId === -1) {
            throw new Error('User not found');
        }

        const updatedUser = {
            ...users[userId],
            ...req.body,
            id: users[userId].id
        };

        users[userId] = updatedUser;
        await saveUsers(users);
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    }

    //user delete
    async userDelete(req: Request, res: Response): Promise<void> {

        const users: User[] = await getUsers();
        const userId = users.findIndex(u => u.id.toString() === req.params.id.toString());

        if (userId === -1) {
            throw new Error(`User with ID ${req.params.id} not found`);
        }

        const deletedUser = users.splice(userId, 1)[0];
        await saveUsers(users);
        res.status(200).json({
            message: `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`,
            user: deletedUser,
        });
    }
}