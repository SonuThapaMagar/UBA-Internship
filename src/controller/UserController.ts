import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { UserCreate, UserOptions, AddressCreate, AddressOptions } from '../types/User';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { ALLOWED_ADDRESS_FIELDS } from '../constants/allowedFields';

export class UserController {
    constructor(private readonly userService: UserService) {
        // Bind methods to preserve 'this' context
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
        this.refreshToken = this.refreshToken.bind(this);
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { body } = req;
            const newUser = await this.userService.createUser(body as UserCreate);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async userList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = req;
            const users = await this.userService.getUsers(query as UserOptions);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params } = req;
            const { id } = params;
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async userUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params, body } = req;
            const { id } = params;
            const updatedUser = await this.userService.updateUser(id, body as UserOptions);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async userDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params } = req;
            const { id: userId } = params;
            await this.userService.deleteUser(userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params, body } = req;
            const { userId } = params;
            const address = await this.userService.createAddress(userId, body as AddressCreate);
            res.status(201).json(address);
        } catch (error) {
            next(error);
        }
    }

    async addressList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = req;
            const { userId } = query;
            const addresses = await this.userService.getAddresses(userId as string | undefined);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }

    async getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params } = req;
            const { id: addressId } = params;
            const address = await this.userService.getAddressById(addressId);
            res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    }

    async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params, body } = req;
            const { id: addressId } = params;
            const hasValidField = Object.keys(body || {}).some(field =>
                ALLOWED_ADDRESS_FIELDS.includes(field as typeof ALLOWED_ADDRESS_FIELDS[number])
            );
            if (!hasValidField) {
                next(new Error(ERROR_MESSAGES.INVALID_UPDATE_DATA));
                return;
            }
            const updatedAddress = await this.userService.updateAddress(addressId, body as AddressOptions);
            res.status(200).json(updatedAddress);
        } catch (error) {
            next(error);
        }
    }

    async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { params } = req;
            const { id: addressId } = params;
            await this.userService.deleteAddress(addressId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const tokens = await this.userService.login(email, password);
            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.userService.refreshToken(refreshToken);
            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    }
}