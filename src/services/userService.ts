import { User as IUser, UserCreate, UserOptions } from '../types/User';
import { User } from '../entity/User';
import { AppDataSource } from '../data/mysql';
import { Address } from '../entity/Address';

export class UserService {
    private userRepo = AppDataSource.getRepository(User);
    private addressRepo = AppDataSource.getRepository(Address);

    async getUsers(options: UserOptions = {}): Promise<IUser[]> {
        const where: any = {};
        if (options.fname) where.fname = options.fname;
        if (options.lname) where.lname = options.lname;

        return await this.userRepo.find({ where, relations: ['addresses'] });
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['addresses'] });
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
        const user = await this.userRepo.findOne({ where: { id }, relations: ['addresses'] });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        const updatedUser = this.userRepo.merge(user, userData);
        return await this.userRepo.save(updatedUser);
    }

    async deleteUser(id: string): Promise<IUser> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['addresses'] });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.remove(user);
        return user;
    }

    async createAddress(userId: string, addressData: {
        street: string; city: string; country: string
    }):
        Promise<Address> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const address = this.addressRepo.create({ ...addressData, user });
        return await this.addressRepo.save(address);
    }


    async getUsersWithAddressCount(): Promise<any[]> {
        const query = `
        WITH AddressCount AS (
            SELECT userId, COUNT(*) as address_count
            FROM address
            GROUP BY userId
        )
            SELECT u.id, u.fname, u.lname, COALESCE(ac.address_count, 0) as address_count
            FROM user u
            LEFT JOIN AddressCount ac ON u.id = ac.userId
       `;
        return await this.userRepo.query(query);
    }
}
export const userService = new UserService();