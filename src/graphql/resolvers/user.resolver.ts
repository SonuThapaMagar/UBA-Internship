import { UserService } from '../../services/userService';
import { UserRole } from '../../types/auth.types';

const userService = new UserService();

export const userResolvers = {
    Query: {
        user: async (_: any, { id }: { id: string }, context: { user?: { id: string; role: UserRole } }) => {
            if (!context.user) throw new Error('Authentication required');
            if (context.user.role !== UserRole.ADMIN && context.user.id !== id) {
                throw new Error('Access denied');
            }
            return await userService.getUserById(id);
        },
        users: async (_: any, __: any, context: { user?: { role: UserRole } }) => {
            if (!context.user || context.user.role !== UserRole.ADMIN) {
                throw new Error('Admin access required');
            }
            return await userService.getUsers();
        },
    },

    Mutation: {
        createUser: async (_: any, { input }: { input: any }, context: {
            user?: {

                role: UserRole
            }
        }) => {
            if (!context.user || context.user.role !== UserRole.ADMIN) {
                throw new Error('Admin access required');
            }
            if (!input.fname || !input.lname || !input.email || !input.password) {
                throw new Error('All fields are required');
            }
            return await userService.createUser(input);
        },

        updateUser: async (_: any, { id, input }: { id: string; input: any }, context: { user?: { id: string; role: UserRole } }) => {
            if (!context.user) throw new Error('Authentication required');
            if (context.user.role !== UserRole.ADMIN && context.user.id !== id) {
                throw new Error('Access denied');
            }
            return await userService.updateUser(id, input);
        },

        deleteUser: async (_: any, { id }: { id: string }, context: { user?: { id: string; role: UserRole } }) => {
            if (!context.user || context.user.role !== UserRole.ADMIN) {
                throw new Error('Admin access required');
            }
            await userService.deleteUser(id);
            return true;
        },
        login: async (_: any, { email, password }: { email: string; password: string }) => {
            return await userService.login(email, password);
        },
    },
};