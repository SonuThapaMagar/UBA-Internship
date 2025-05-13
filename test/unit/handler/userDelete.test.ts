import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userDelete } from '../../../src/handler/userDelete';
import { userService } from '../../../src/services/userService';

// Mock the entire module (shared with userCreate tests)
vi.mock('../../../src/services/userService');

describe('userDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log success message when user is deleted', async () => {
    // Mock a user to be deleted
    const mockUser = { 
      id: '123', 
      fname: 'John', 
      lname: 'Doe' 
    };
    
    (userService.deleteUser as any).mockResolvedValue(mockUser);
    const consoleSpy = vi.spyOn(console, 'log');
    
    await userDelete({ id: '123' });
    
    // Verify service was called correctly
    expect(userService.deleteUser).toHaveBeenCalledWith('123');
    // Verify success message
    expect(consoleSpy).toHaveBeenCalledWith(
      'Successfully deleted user: John Doe'
    );
  });

  it('should throw error when user not found', async () => {
    // Mock failed deletion
    (userService.deleteUser as any).mockRejectedValue(new Error('User not found'));
    
    // Verify error is thrown
    await expect(userDelete({ id: '999' }))
      .rejects.toThrow('User not found');
  });
});