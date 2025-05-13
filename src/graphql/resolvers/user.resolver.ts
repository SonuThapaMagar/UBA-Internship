import { userService } from "../../services/userService";
import { User } from "../../types/User"

export const userResolvers = {
    Query: {
        users: async (): Promise<User[]> => {
            return await userService.getUsers();
        },
        user: async (_: any, { id }: { id: string }): Promise<User | null> => {
            try {
                return await userService.getUserById(id);
            } catch (error) {
                return null;
            }
        },
    },

    Mutation: {
        createUser: async (_: any, { input }: { input: { fname: string, lname: string } }): Promise<User> => {
            return await userService.createUser(input);
        },

        updateUser: async (_: any, { id, input }: { id: string, input: { fname?: string, lname?: string } }): Promise<User> => {
            return await userService.updateUser(id, input);
        },

        deleteUser: async (_: any, { id }: { id: string }): Promise<Boolean> => {
            try {
                await userService.deleteUser(id);
                return true

            } catch (error) {
                return false;
            }
        }
    }
};
