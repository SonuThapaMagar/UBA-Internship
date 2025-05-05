import { User as IUser, UserCreate, UserOptions } from '../types/User';
import User from "../data/models/User.models";

//Service layer for user operations
export class UserService {
    async getUsers(options: UserOptions = {}): Promise<IUser[]> {
        const query: any = {};
        if (options.fname) query.fname = { $regex: options.fname, $options: 'i' };
        if (options.lname) query.lname = { $regex: options.lname, $options: 'i' };

        const users = await User.find(query).lean();
        return users.map(user => ({
            id: user._id.toString(),
            ...user
        }));
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await User.findById(id).lean();
        if (!user) throw new Error('User not found');
        return {
            id: user._id.toString(),
            ...user
        };
    }

    async createUser(userData: UserCreate): Promise<IUser> {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return {
            id: savedUser._id.toString(),
            ...savedUser.toObject()
        };
    }

    async updateUser(id: string, userData: UserOptions): Promise<IUser> {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            userData,
            { new: true }
        ).lean();

        if (!updatedUser) throw new Error('User not found');
        return {
            id: updatedUser._id.toString(),
            ...updatedUser
        };
    }

    async deleteUser(id: string): Promise<IUser> {
        const deletedUser = await User.findByIdAndDelete(id).lean();
        if (!deletedUser) throw new Error('User not found');
        return {
            id: deletedUser._id.toString(),
            ...deletedUser
        };
    }
}
export const userService = new UserService();