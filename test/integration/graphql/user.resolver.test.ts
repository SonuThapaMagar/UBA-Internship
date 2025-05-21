import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userResolvers } from '../../../src/graphql/resolvers/user.resolver';
import { UserService } from '../../../src/services/userService';

vi.mock('../../../src/services/userService', () => {
    const mockGetUsers = vi.fn();
    const mockGetUserById = vi.fn();
    const mockCreateUser = vi.fn();
    const mockUpdateUser = vi.fn();
    const mockDeleteUser = vi.fn();
    const mockCreateAddress = vi.fn();
    return {
        UserService: vi.fn().mockImplementation(() => ({
            getUsers: mockGetUsers,
            getUserById: mockGetUserById,
            createUser: mockCreateUser,
            updateUser: mockUpdateUser,
            deleteUser: mockDeleteUser,
            createAddress: mockCreateAddress,
        })),
    };
});

describe('User Resolvers', () => {
    const mockUserService = new UserService();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Query', () => {
        it('users: should return all users', async () => {
            const users = [{ id: '1', fname: 'John', lname: 'Doe', addresses: [] }];
            vi.mocked(mockUserService.getUsers).mockResolvedValue(users);
            const result = await userResolvers.Query.users();
            expect(result).toEqual(users);
            expect(mockUserService.getUsers).toHaveBeenCalled();
        });

        it('user: should return a user by id', async () => {
            const user = { id: '1', fname: 'John', lname: 'Doe', addresses: [] };
            vi.mocked(mockUserService.getUserById).mockResolvedValue(user);
            const result = await userResolvers.Query.user(null, { id: '1' });
            expect(result).toEqual(user);
            expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
        });

        it('user: should return null if user not found', async () => {
            vi.mocked(mockUserService.getUserById).mockRejectedValue(new Error('Not found'));
            const result = await userResolvers.Query.user(null, { id: '2' });
            expect(result).toBeNull();
        });
    });

    describe('Mutation', () => {
        it('createUser: should create a user', async () => {
            const input = { fname: 'Jane', lname: 'Smith' };
            const createdUser = { id: '2', ...input, addresses: [] };
            vi.mocked(mockUserService.createUser).mockResolvedValue(createdUser);
            const result = await userResolvers.Mutation.createUser(null, { input });
            expect(result).toEqual(createdUser);
            expect(mockUserService.createUser).toHaveBeenCalledWith(input);
        });

        it('updateUser: should update a user', async () => {
            const input = { fname: 'Jane', lname: 'Doe' };
            const updatedUser = { id: '1', ...input, addresses: [] };
            vi.mocked(mockUserService.updateUser).mockResolvedValue(updatedUser);
            const result = await userResolvers.Mutation.updateUser(null, { id: '1', input });
            expect(result).toEqual(updatedUser);
            expect(mockUserService.updateUser).toHaveBeenCalledWith('1', input);
        });

        it('deleteUser: should delete a user and return true', async () => {
            vi.mocked(mockUserService.deleteUser).mockResolvedValue({ id: '1', fname: 'John', lname: 'Doe', addresses: [] });
            const result = await userResolvers.Mutation.deleteUser(null, { id: '1' });
            expect(result).toBe(true);
            expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
        });

        it('deleteUser: should return false if deletion fails', async () => {
            vi.mocked(mockUserService.deleteUser).mockRejectedValue(new Error('Delete failed'));
            const result = await userResolvers.Mutation.deleteUser(null, { id: '2' });
            expect(result).toBe(false);
        });

        it('createAddress: should create an address for a user', async () => {
            const userId = '1';
            const input = { street: '123 Main St', city: 'Metropolis', country: 'USA' };
            const updatedUser = { id: userId, fname: 'John', lname: 'Doe', addresses: [input] };
            vi.mocked(mockUserService.createAddress).mockResolvedValue(updatedUser as any); 
            const result = await userResolvers.Mutation.createAddress(null, { userId, input });
            expect(result).toEqual(updatedUser);
            expect(mockUserService.createAddress).toHaveBeenCalledWith(userId, input);
        });
    });
});