import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userCreate } from '../../../src/handler/userCreate';
import { userService } from '../../../src/services/userService';

// Mock the entire module
vi.mock('../../../src/services/userService');

describe('userCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log success message', async () => {
    // Type assertion here if needed
    (userService.createUser as any).mockResolvedValue({ id: '123' });
    const consoleSpy = vi.spyOn(console, 'log');
    
    await userCreate({ fname: 'John', lname: 'Doe' });
    
    expect(userService.createUser).toHaveBeenCalledWith({
      fname: 'John',
      lname: 'Doe'
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      'User created successfully! ID: 123'
    );
  });
});