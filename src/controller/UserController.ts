import { Request, Response } from 'express';
import { userService } from '../services/userService'
import { UserCreate, UserOptions } from '../types/User';

export class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        const newUser = await userService.createUser(req.body as UserCreate);
        res.status(201).json(newUser);
    }

    async userList(req: Request, res: Response): Promise<void> {

        const users = await userService.getUsers(req.query as UserOptions);
        res.status(200).json(users);
    }

    async getUserById(req: Request, res: Response): Promise<void> {

        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    }

    async userUpdate(req: Request, res: Response): Promise<void> {

        const updatedUser = await userService.updateUser(
            req.params.id,
            req.body as UserOptions
        );
        res.status(200).json(updatedUser);

    }

    async userDelete(req: Request, res: Response): Promise<void> {

        const deletedUser = await userService.deleteUser(req.params.id);
        // res.status(204).json(deletedUser);
        res.status(204).send();

    }
}