import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { UserCreate, UserOptions, AddressCreate, AddressOptions } from '../types/User';

export class UserController {
    private userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService || new UserService();
        this.createUser = this.createUser.bind(this);
        this.userList = this.userList.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.userUpdate = this.userUpdate.bind(this);
        this.userDelete = this.userDelete.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.addressList = this.addressList.bind(this);
        this.getAddressById = this.getAddressById.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.login = this.login.bind(this);
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            const user = await this.userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async userUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const updatedUser = await this.userService.updateUser(id, req.body as UserOptions);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async userDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId as string;
            if (!userId) {
                next(new Error('Missing userId parameter'));
                return;
            }
            const address = await this.userService.createAddress(userId, req.body as AddressCreate);
            res.status(201).json(address);
        } catch (error) {
            next(error);
        }
    }

    async addressList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.query.userId as string | undefined;
            const addresses = await this.userService.getAddresses(userId);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }

    async getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            if (!id) {
                next(new Error('Missing address ID'));
                return;
            }
            const address = await this.userService.getAddressById(id);
            res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    }

    async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            if (!id) {
                next(new Error('Missing address ID'));
                return;
            }
            const allowedFields = ['street', 'city', 'country', 'postalCode', 'state', 'type'];
            const hasValidField = Object.keys(req.body || {}).some(field => allowedFields.includes(field));
            if (!hasValidField) {
                next(new Error('Invalid update data'));
                return;
            }
            const updatedAddress = await this.userService.updateAddress(id, req.body as AddressOptions);
            res.status(200).json(updatedAddress);
        } catch (error) {
            next(error);
        }
    }

    async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            if (!id) {
                next(new Error('Missing address ID'));
                return;
            }
            await this.userService.deleteAddress(id);
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