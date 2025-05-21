import { UserCreate, UserOptions, AddressCreate, AddressOptions } from '../types/User';
import { User } from '../entity/User';
import { Address } from '../entity/Address';
import { AppDataSource } from '../data/mysql';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserService {
    private userRepo = AppDataSource.getRepository(User);
    private addressRepo = AppDataSource.getRepository(Address);

    async getUsers(options?: UserOptions): Promise<User[]> {
        return this.userRepo.find({ where: options ?? {} });
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['addresses'] });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    async createUser(data: UserCreate): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = this.userRepo.create({ ...data, password: hashedPassword });
        return await this.userRepo.save(newUser);
    }

    async updateUser(id: string, data: UserOptions): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        this.userRepo.merge(user, data);
        return this.userRepo.save(user);
    }

    async deleteUser(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.remove(user);
        return user;
    }

    async createAddress(userId: string, data: AddressCreate): Promise<Address> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const address = this.addressRepo.create({ ...data, user });
        return await this.addressRepo.save(address);
    }

    async getAddresses(userId?: string): Promise<Address[]> {
        const where = userId ? { user: { id: userId } } : {};
        return this.addressRepo.find({ where, relations: ['user'] });
    }

    async getAddressById(id: string): Promise<Address> {
        const address = await this.addressRepo.findOne({ where: { id }, relations: ['user'] });
        if (!address) {
            throw new Error(`Address with ID ${id} not found`);
        }
        return address;
    }

    async updateAddress(id: string, data: AddressOptions): Promise<Address> {
        const address = await this.addressRepo.findOne({ where: { id } });
        if (!address) {
            throw new Error(`Address with ID ${id} not found`);
        }
        this.addressRepo.merge(address, data);
        return this.addressRepo.save(address);
    }

    async deleteAddress(id: string): Promise<Address> {
        const address = await this.addressRepo.findOne({ where: { id } });
        if (!address) {
            throw new Error(`Address with ID ${id} not found`);
        }
        await this.addressRepo.remove(address);
        return address;
    }

    async getUsersWithAddressCount(): Promise<any[]> {
        return this.userRepo.query(`
            WITH UserAddresses AS (
                SELECT 
                    u.id,
                    u.fname,
                    u.lname,
                    COUNT(a.id) as address_count,
                    JSON_ARRAYAGG(
                        IF(a.id IS NOT NULL,
                            JSON_OBJECT(
                                'id', a.id,
                                'street', a.street,
                                'city', a.city,
                                'country', a.country
                            ),
                            NULL
                        )
                    ) as addresses
                FROM user u
                LEFT JOIN address a ON u.id = a.userId
                GROUP BY u.id, u.fname, u.lname
            )
            SELECT 
                id,
                fname,
                lname,
                address_count,
                JSON_EXTRACT(addresses, '$[*]') as addresses
            FROM UserAddresses
            ORDER BY fname, lname
        `);
    }

    async login(email: string, password: string): Promise<string> {
        console.log(`Attempting login for email: ${email}`);
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            throw new Error('Invalid credentials');
        }

        console.log(`Found user: ${user.fname} ${user.lname}`);
        console.log(`Stored password hash: ${user.password}`);
        console.log(`Input password: ${password}`);
        
        const isValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isValid}`);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign(
            { id: user.id, fname: user.fname, email: user.email },
            secret,
            { expiresIn: '1h' }
        );
        return token;
    }
}