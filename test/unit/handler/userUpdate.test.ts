import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userUpdate } from '../../../src/handler/userUpdate';
import { UserService } from '../../../src/services/userService';

vi.mock('../../../src/services/userService', () => ({
    UserService: vi.fn(() => ({
        updateUser: vi.fn()
    }))
}));

describe('userUpdate handler', () => {
    let mockUpdateUser: ReturnType<typeof vi.fn>;
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        mockUpdateUser = vi.fn();
        const MockUserService = vi.mocked(UserService);
        MockUserService.mockImplementation(() => ({
            updateUser: mockUpdateUser
        }) as any);

        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update a user and log success', async () => {
        const id = '123';
        const options = { fname: 'Updated' };
        const mockUpdatedUser = { id: '123', fname: 'Updated', lname: 'User' };

        mockUpdateUser.mockResolvedValue(mockUpdatedUser);

        await userUpdate(id, options);

        expect(mockUpdateUser).toHaveBeenCalledWith(id, options);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'User updated successfully! ID: 123'
        );
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle errors and log error message', async () => {
        const id = '123';
        const options = { fname: 'Updated' };
        const mockError = new Error('Update failed');

        mockUpdateUser.mockRejectedValue(mockError);

        await userUpdate(id, options);

        expect(mockUpdateUser).toHaveBeenCalledWith(id, options);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error updating user:',
            'Update failed'
        );
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should handle unknown errors', async () => {
        const id = '123';
        const options = { fname: 'Updated' };

        mockUpdateUser.mockRejectedValue('Non-error value');

        await userUpdate(id, options);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'An unknown error occurred.'
        );
    });
});