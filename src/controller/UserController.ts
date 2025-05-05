import { Request, Response } from 'express';
import { userService } from '../services/userService'
import { UserCreate, UserOptions } from '../types/User';

//Controller for handling HTTP requests
export class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        const newUser = await userService.createUser(req.body as UserCreate);
        res.status(201).json(newUser);
    }

    //Get all user
    async userList(req: Request, res: Response): Promise<void> {

        const users = await userService.getUsers(req.query as UserOptions);
        res.json(users);
    }

    //get user by id
    async getUserById(req: Request, res: Response): Promise<void> {

        const user = await userService.getUserById(req.params.id);
        res.json(user);
    }

    //update user
    async userUpdate(req: Request, res: Response): Promise<void> {

        const updatedUser = await userService.updateUser(
            req.params.id,
            req.body as UserOptions
        );
        res.json(updatedUser);

    }

    //user delete
    async userDelete(req: Request, res: Response): Promise<void> {

        const deletedUser = await userService.deleteUser(req.params.id);
        res.json(deletedUser);

    }
}