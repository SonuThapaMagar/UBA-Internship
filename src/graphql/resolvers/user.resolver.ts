import { UserService } from '../../services/userService';

const userService = new UserService(); 

export const userResolvers = {
    Query: {
        users: async () => {
            return await userService.getUsers();
        },
        user: async (_: any, { id }: { id: string }) => {
            try {
                return await userService.getUserById(id);
            } catch {
                return null;
            }
        },
    },
    Mutation: {
        createUser: async (_: any, { input }: { input: any }) => {
            return await userService.createUser(input);
        },
        updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
            return await userService.updateUser(id, input);
        },
        deleteUser: async (_: any, { id }: { id: string }) => {
            try {
                await userService.deleteUser(id);
                return true;
            } catch {
                return false;
            }
        },
        createAddress: async (_: any, { userId, input }: { userId: string; input: any }) => {
            return await userService.createAddress(userId, input);
        },
    },
};