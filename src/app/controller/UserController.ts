import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { UserCreate, UserOptions } from '../../types/User';

export class UserController {
    constructor(private readonly userService: UserService) {
        this.register = this.register.bind(this);
        this.userList = this.userList.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.userUpdate = this.userUpdate.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUser = await this.userService.createUser(req.body as UserCreate);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async userList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.userService.getUsers(req.query as UserOptions);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async userUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.updateUser(id, req.body as UserOptions);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async userDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                next(new Error('Email and password are required'));
                return;
            }
            const token = await this.userService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}