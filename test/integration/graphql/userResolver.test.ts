import { beforeEach, vi, describe, expect, it } from "vitest";
import { User } from "../../../src/types/User";
import { userService } from "../../../src/services/userService";
import { userResolvers } from "../../../src/graphql/resolvers/user.resolver";

vi.mock('../../../src/services/userService');


const mockUsers: User[] = [
    { id: '1', fname: 'Alice', lname: 'Smith' },
    { id: '2', fname: 'Bob', lname: 'Johnson' },
]

describe('userResolvers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (userService.getUsers as any).mockReset();
        (userService.getUserById as any).mockReset();
    });
    describe('Query:', () => {
        describe('users', () => {
            it('should return all users', async () => {
                //arrange
                (userService.getUsers as any).mockResolvedValue(mockUsers);

                //act
                const result = await userResolvers.Query.users();

                //assert
                expect(userService.getUsers).toHaveBeenCalled();
                expect(result).toEqual(mockUsers);
            });

            it('should handle errors', async () => {
                // Arrange
                const error = new Error('Database error');
                (userService.getUsers as any).mockRejectedValue(error);

                // Act & Assert
                await expect(userResolvers.Query.users()).rejects.toThrow(error);
            })
        })

        describe('user', () => {
            it('should return a user by id', async () => {
                const mockUser = mockUsers[0];
                (userService.getUserById as any).mockResolvedValue(mockUser);
                const result = await userResolvers.Query.user({}, { id: '1' });
                expect(userService.getUserById).toHaveBeenCalledWith('1');
                expect(result).toEqual(mockUser);
            })

            it('should return null if user not found', async () => {
                (userService.getUserById as any).mockResolvedValue(null);
                const result = await userResolvers.Query.user({}, { id: '999' });
                expect(result).toBeNull();
            })

            it('should handle errors', async () => {
                const error = new Error('Database error');
                (userService.getUserById as any).mockRejectedValue(error);
                await expect(userResolvers.Query.user({}, { id: '1' })).rejects.toThrow('Database error');

            });
        })
    })

    describe('Mutation', () => {
        describe('Create user', () => {
            it('should create a new user', async () => {
                const newUser = { id: '3', fname: 'Alice', lname: 'Johnson' };
                const input = { fname: 'Alice', lname: 'Johnson' };
                (userService.createUser as any).mockResolvedValue(newUser);

                const result = await userResolvers.Mutation.createUser({}, { input });

                expect(result).toEqual(newUser);
                expect(userService.createUser).toHaveBeenCalledWith(input);
            })

            it('should handle error', async () => {
                const error = new Error('Creation failed');
                const input = { fname: 'Alice', lname: 'Johnson' };
                (userService.createUser as any).mockRejectedValue(error);

                await expect(userResolvers.Mutation.createUser({}, { input })).rejects.toThrow(error);
            })

        })

        describe('update user', () => {
            it('should update the user', async () => {
                const updatedUser = { id: '1', fname: 'Johnny', lname: 'Doe' };
                const id = '1';
                const input = { fname: 'Johnny' };
                (userService.updateUser as any).mockResolvedValue(updatedUser);

                const result = await userResolvers.Mutation.updateUser({}, { id, input });

                expect(result).toEqual(updatedUser);
                expect(userService.updateUser).toHaveBeenCalledWith(id, input);
            });

            it('should handle error', async () => {
                const error = new Error('Update failed');
                const id = '1'
                const input = { fname: 'Johnny' };
                (userService.updateUser as any).mockRejectedValue(error);

                await expect(userResolvers.Mutation.updateUser({}, { id, input })).rejects.toThrow(error);
            })
        })

        describe('delete user', () => {
            it('should delete the user', async () => {
                const deletedUser = { id: '1', fname: 'John', lname: 'Doe' };
                const id = '1';
                (userService.deleteUser as any).mockResolvedValue(deletedUser);

                const result = await userResolvers.Mutation.deleteUser({}, { id });

                expect(result).toEqual(deletedUser);
                expect(userService.deleteUser).toHaveBeenCalledWith(id);
            });

            it('should handle error', async () => {
                const error = new Error('Deletion failed');
                const id = '1';
                (userService.deleteUser as any).mockRejectedValue(error);

                await expect(userResolvers.Mutation.deleteUser({}, { id })).rejects.toThrow(error);
            })
        })
    })


})
