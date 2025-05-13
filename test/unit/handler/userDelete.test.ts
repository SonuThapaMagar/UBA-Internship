import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userDelete } from '../../../src/handler/userDelete';
import { userService } from '../../../src/services/userService';

vi.mock('../../../src/services/userService');

describe('userDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log success message when user is deleted', async () => {
    const mockUser = { 
      id: '123', 
      fname: 'John', 
      lname: 'Doe' 
    };
    
    (userService.deleteUser as any).mockResolvedValue(mockUser);
    const consoleSpy = vi.spyOn(console, 'log');
    
    await userDelete({ id: '123' });
    
    expect(userService.deleteUser).toHaveBeenCalledWith('123');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Successfully deleted user: John Doe'
    );
  });

  it('should throw error when user not found', async () => {
    (userService.deleteUser as any).mockRejectedValue(new Error('User not found'));
    
    await expect(userDelete({ id: '999' }))
      .rejects.toThrow('User not found');
  });
});