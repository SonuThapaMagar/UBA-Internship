import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { userDelete } from '../../../src/handler/userDelete';
import { UserService } from '../../../src/services/userService';

vi.mock('../../../src/services/userService');

describe('userDelete handler', () => {
  let mockDeleteUser: ReturnType<typeof vi.fn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockDeleteUser = vi.fn();
    (UserService as Mock).mockImplementation(() => ({
      deleteUser: mockDeleteUser,
    }));
    
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully delete a user and log success message', async () => {
    const input = { id: '123' };
    const mockUser = { id: '123', fname: 'John', lname: 'Doe' };
    
    mockDeleteUser.mockResolvedValue(mockUser);
    
    await userDelete(input);
    
    expect(mockDeleteUser).toHaveBeenCalledWith(input.id);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Successfully deleted user: ${mockUser.fname} ${mockUser.lname}`
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle errors and log error message', async () => {
    const input = { id: '123' };
    const mockError = new Error('Database connection failed');
    
    mockDeleteUser.mockRejectedValue(mockError);
    
    await userDelete(input);
    
    expect(mockDeleteUser).toHaveBeenCalledWith(input.id);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting user:',
      mockError.message
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('should handle unknown errors and log generic message', async () => {
    const input = { id: '123' };
    const mockError = 'Some string error'; 
    
    mockDeleteUser.mockRejectedValue(mockError);
    
    await userDelete(input);
    
    expect(mockDeleteUser).toHaveBeenCalledWith(input.id);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting user:',
      'An unknown error occurred.'
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});