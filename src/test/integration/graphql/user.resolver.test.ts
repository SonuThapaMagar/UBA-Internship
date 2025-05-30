import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userResolvers } from '../../../app/graphql/resolvers/user.resolver';
import { UserService } from '../../../app/services/userService';
import { UserRole } from '../../../types/auth.types';
import { User, UserCreate, UserOptions } from '../../../types/User';

vi.mock('../../../app/services/userService', () => {
    const mockGetUsers = vi.fn().mockImplementation(() => Promise.resolve([]));
    const mockGetUserById = vi.fn().mockImplementation(() => Promise.resolve(null));
    const mockCreateUser = vi.fn().mockImplementation(() => Promise.resolve(null));
    const mockUpdateUser = vi.fn().mockImplementation(() => Promise.resolve(null));
    const mockDeleteUser = vi.fn().mockImplementation(() => Promise.resolve(null));
    const mockLogin = vi.fn().mockImplementation(() => Promise.resolve(''));

    return {
        UserService: vi.fn().mockImplementation(() => ({
            getUsers: mockGetUsers,
            getUserById: mockGetUserById,
            createUser: mockCreateUser,
            updateUser: mockUpdateUser,
            deleteUser: mockDeleteUser,
            login: mockLogin
        }))
    };
});

describe('User Resolvers', () => {
    const mockUser: User = {
        id: '1',
        fname: 'John',
        lname: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user'
    };

    const mockUserService = new UserService();
    const adminContext = { user: { id: '1', role: UserRole.ADMIN } };
    const userContext = { user: { id: '2', role: UserRole.USER } };
    const noAuthContext = { user: undefined };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Query', () => {
        it('users: should return all users for admin', async () => {
            const users = [mockUser];
            (mockUserService.getUsers as ReturnType<typeof vi.fn>).mockResolvedValue(users);
            const result = await userResolvers.Query.users(null, null, adminContext);
            expect(result).toEqual(users);
            expect(mockUserService.getUsers).toHaveBeenCalled();
        });

        it('users: should throw error for non-admin user', async () => {
            await expect(userResolvers.Query.users(null, null, userContext))
                .rejects
                .toThrow('Admin access required');
        });

        it('users: should throw error for unauthenticated user', async () => {
            await expect(userResolvers.Query.users(null, null, noAuthContext))
                .rejects
                .toThrow('Admin access required');
        });

        it('user: should return a user by id for admin', async () => {
            (mockUserService.getUserById as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
            const result = await userResolvers.Query.user(null, { id: '1' }, adminContext);
            expect(result).toEqual(mockUser);
            expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
        });

        it('user: should return a user by id for self', async () => {
            const selfUser = { ...mockUser, id: '2' };
            (mockUserService.getUserById as ReturnType<typeof vi.fn>).mockResolvedValue(selfUser);
            const result = await userResolvers.Query.user(null, { id: '2' }, userContext);
            expect(result).toEqual(selfUser);
            expect(mockUserService.getUserById).toHaveBeenCalledWith('2');
        });

        it('user: should throw error when accessing other user data', async () => {
            await expect(userResolvers.Query.user(null, { id: '1' }, userContext))
                .rejects
                .toThrow('Access denied');
        });
    });

    describe('Mutation', () => {
        it('createUser: should create a user for admin', async () => {
            const input: UserCreate = { fname: 'Jane', lname: 'Smith', email: 'jane@example.com', password: 'password123' };
            const createdUser = { ...mockUser, ...input, id: '2' };
            (mockUserService.createUser as ReturnType<typeof vi.fn>).mockResolvedValue(createdUser);
            const result = await userResolvers.Mutation.createUser(null, { input }, adminContext);
            expect(result).toEqual(createdUser);
            expect(mockUserService.createUser).toHaveBeenCalledWith(input);
        });

        it('createUser: should throw error for non-admin user', async () => {
            const input: UserCreate = { fname: 'Jane', lname: 'Smith', email: 'jane@example.com', password: 'password123' };
            await expect(userResolvers.Mutation.createUser(null, { input }, userContext))
                .rejects
                .toThrow('Admin access required');
        });

        it('updateUser: should update a user for admin', async () => {
            const input: UserOptions = { fname: 'Jane', lname: 'Doe' };
            const updatedUser = { ...mockUser, ...input };
            (mockUserService.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser);
            const result = await userResolvers.Mutation.updateUser(null, { id: '1', input }, adminContext);
            expect(result).toEqual(updatedUser);
            expect(mockUserService.updateUser).toHaveBeenCalledWith('1', input);
        });

        it('updateUser: should update own user', async () => {
            const input: UserOptions = { fname: 'Jane', lname: 'Doe' };
            const updatedUser = { ...mockUser, ...input, id: '2' };
            (mockUserService.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser);
            const result = await userResolvers.Mutation.updateUser(null, { id: '2', input }, userContext);
            expect(result).toEqual(updatedUser);
            expect(mockUserService.updateUser).toHaveBeenCalledWith('2', input);
        });

        it('updateUser: should throw error when updating other user', async () => {
            const input: UserOptions = { fname: 'Jane', lname: 'Doe' };
            await expect(userResolvers.Mutation.updateUser(null, { id: '1', input }, userContext))
                .rejects
                .toThrow('Access denied');
        });

        it('deleteUser: should delete a user for admin', async () => {
            (mockUserService.deleteUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
            const result = await userResolvers.Mutation.deleteUser(null, { id: '1' }, adminContext);
            expect(result).toBe(true);
            expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
        });

        it('deleteUser: should throw error for non-admin user', async () => {
            await expect(userResolvers.Mutation.deleteUser(null, { id: '1' }, userContext))
                .rejects
                .toThrow('Admin access required');
        });

        it('login: should login a user', async () => {
            const loginInput = { email: 'john@example.com', password: 'password123' };
            const token = 'mock-jwt-token';
            (mockUserService.login as ReturnType<typeof vi.fn>).mockResolvedValue(token);
            const result = await userResolvers.Mutation.login(null, loginInput);
            expect(result).toEqual(token);
            expect(mockUserService.login).toHaveBeenCalledWith(loginInput.email, loginInput.password);
        });
    });
});