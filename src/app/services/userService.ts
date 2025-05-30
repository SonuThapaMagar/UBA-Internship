import { UserCreate, UserOptions } from '../../types/User';
import { User } from '../../entity/User';
import { Internship } from '../../entity/Internship';
import { AppDataSource } from '../../data/mysql';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserService {
    private userRepo = AppDataSource.getRepository(User);
    private internRepo = AppDataSource.getRepository(Internship);

    async getUsers(options?: UserOptions): Promise<User[]> {
        return this.userRepo.find({ where: options ?? {}, relations: ['internships'] });
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['internships'] });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    async createUser(data: UserCreate): Promise<User> {
        const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = this.userRepo.create({
            ...data,
            password: hashedPassword,
            role: data.role || 'user',
        });
        return await this.userRepo.save(newUser);
    }

    async updateUser(id: string, data: UserOptions): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
            if (existingUser) {
                throw new Error('Email already in use');
            }
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
        // Delete associated internships first
        await this.internRepo.delete({ user: { id } });
        await this.userRepo.remove(user);
        return user;
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign(
            { id: user.id, fname: user.fname, email: user.email, role: user.role.toLowerCase() },
            secret,
            { expiresIn: '1h' }
        );
        return token;
    }
}