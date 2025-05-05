import { userService } from "../../services/userService";
import { User } from "../../types/User"

export const userResolvers = {
    Query: {
        users: async (): Promise<User[]> => {
            return await userService.getUsers();
        },
        user: async (_: any, { id }: { id: string }): Promise<User | null> => {
            const users = await userService.getUsers();
            return users.find(u => u.id === id) || null;
        },
    },

    Mutation: {
        createUser: async (_: any, { input }: { input: { fname: string, lname: string } }): Promise<User> => {
            return await userService.createUser(input);
        },

        updateUser: async (_: any, { id, input }: { id: string, input: { fname?: string, lname?: string } }): Promise<User> => {
            return await userService.updateUser(id, input);
        },

        deleteUser: async (_: any, { id }: { id: string }): Promise<User> => {
            return await userService.deleteUser(id);
        }
    }
};
