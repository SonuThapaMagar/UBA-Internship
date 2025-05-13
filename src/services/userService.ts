import { User as IUser, UserCreate, UserOptions } from '../types/User';
import { User } from '../entity/User';
import { AppDataSource } from '../data/mysql';

export class UserService {
    private userRepo = AppDataSource.getRepository(User);

    async getUsers(options: UserOptions = {}): Promise<IUser[]> {
        const where: any = {};
        if (options.fname) where.fname = options.fname;
        if (options.lname) where.lname = options.lname;

        return await this.userRepo.find({ where });
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    async createUser(userData: UserCreate): Promise<IUser> {
        const newUser = this.userRepo.create(userData);
        return await this.userRepo.save(newUser);;
    }

    async updateUser(id: string, userData: UserOptions): Promise<IUser> {
        const user = await this.userRepo.findOneBy({ id })
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        const updatedUser = this.userRepo.merge(user, userData);
        return await this.userRepo.save(updatedUser);
    }

    async deleteUser(id: string): Promise<IUser> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.remove(user);
        return user;
    }
}
export const userService = new UserService();