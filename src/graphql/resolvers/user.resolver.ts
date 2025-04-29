import { getUsers } from "../../db/dbHelper"
import { User } from "../../types/User"

export const userResolvers = {
    Query: {
        users: async (): Promise<User[]> => {
            return await getUsers();
        },
        user: async (_: any, { id }: { id: string }): Promise<User | null> => {
            const users = await getUsers();
            return users.find(u => u.id === id) || null;
        },
    }
};
