import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userUpdate } from '../../../src/handler/userUpdate';
import { User, UserOptions } from '../../../src/types/User';


vi.mock('../../../src/services/userService', () => {
  const mockUserService = {
    updateUser: vi.fn<(id: string, options: UserOptions) => Promise<User>>()
  };
  return {
    userService: mockUserService
  };
});

describe('userUpdate', async() => {
  const mockUserService = vi.mocked((await import('../../../src/services/userService')).userService);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserService.updateUser.mockReset();
  });

  it('should log success message when user is updated successfully', async () => {
   
    const mockUser: User = { id: '1', fname: 'John', lname: 'Doe' };
    mockUserService.updateUser.mockResolvedValue(mockUser);
    const consoleSpy = vi.spyOn(console, 'log');
    const id = '1';
    const options: UserOptions = { fname: 'John', lname: 'Doe' };

   
    await userUpdate(id, options);

   
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, options);
    expect(consoleSpy).toHaveBeenCalledWith('User updated successfully! ID: 1');
  });

  it('should handle known errors gracefully', async () => {
   
    mockUserService.updateUser.mockRejectedValue(new Error('Database error'));
    const consoleSpy = vi.spyOn(console, 'error');
    const id = '1';
    const options: UserOptions = { fname: 'John', lname: 'Doe' };

   
    await userUpdate(id, options);

   
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, options);
    expect(consoleSpy).toHaveBeenCalledWith('Error updating user:', 'Database error');
  });

  it('should handle unknown errors gracefully', async () => {
   
    mockUserService.updateUser.mockRejectedValue('Some weird error');
    const consoleSpy = vi.spyOn(console, 'error');
    const id = '1';
    const options: UserOptions = { fname: 'John', lname: 'Doe' };

   
    await userUpdate(id, options);

   
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, options);
    expect(consoleSpy).toHaveBeenCalledWith('An unknown error occurred.');
  });
});