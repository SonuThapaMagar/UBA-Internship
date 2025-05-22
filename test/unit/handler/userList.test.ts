import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userList } from '../../../src/handler/userList';
import { User, UserOptions } from '../../../src/types/User';

vi.mock('../../../src/services/userService', () => {
  const mockUserService = {
    getUsers: vi.fn<() => Promise<User[]>>()
  };
  return {
    userService: mockUserService
  };
});

describe('userList', async() => {
  const mockUserService = vi.mocked((await import('../../../src/services/userService')).userService);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserService.getUsers.mockReset();
  });

  it('should list all users when no filters are provided', async () => {
     
    const mockUsers: User[] = [
      { id: '1', fname: 'John', lname: 'Doe' },
      { id: '2', fname: 'Jane', lname: 'Smith' }
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    const consoleSpy = vi.spyOn(console, 'log');

    
    await userList({});

    
    expect(consoleSpy).toHaveBeenCalledWith('Users:');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 1, Name: John Doe');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 2, Name: Jane Smith');
  });

  it('should filter users by first name', async () => {
     
    const mockUsers: User[] = [
      { id: '1', fname: 'John', lname: 'Doe' },
      { id: '2', fname: 'Jane', lname: 'Smith' }
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    const consoleSpy = vi.spyOn(console, 'log');

    
    await userList({ fname: 'Ja' });

    
    expect(consoleSpy).toHaveBeenCalledWith('Users:');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 2, Name: Jane Smith');
    expect(consoleSpy).not.toHaveBeenCalledWith('ID: 1, Name: John Doe');
  });

  it('should filter users by last name', async () => {
     
    const mockUsers: User[] = [
      { id: '1', fname: 'John', lname: 'Doe' },
      { id: '2', fname: 'Jane', lname: 'Smith' }
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    const consoleSpy = vi.spyOn(console, 'log');

    
    await userList({ lname: 'Do' });

    
    expect(consoleSpy).toHaveBeenCalledWith('Users:');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 1, Name: John Doe');
    expect(consoleSpy).not.toHaveBeenCalledWith('ID: 2, Name: Jane Smith');
  });

  it('should show "No users found" when filters match nothing', async () => {
     
    const mockUsers: User[] = [
      { id: '1', fname: 'John', lname: 'Doe' },
      { id: '2', fname: 'Jane', lname: 'Smith' }
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    const consoleSpy = vi.spyOn(console, 'log');

    
    await userList({ fname: 'Nonexistent' });

    
    expect(consoleSpy).toHaveBeenCalledWith('No users found.');
  });

  it('should handle service errors gracefully', async () => {
     
    mockUserService.getUsers.mockRejectedValue(new Error('Database error'));
    const consoleSpy = vi.spyOn(console, 'error');

    
    await userList({});

    
    expect(consoleSpy).toHaveBeenCalledWith('Error reading users:', 'Database error');
  });

  it('should handle unknown errors gracefully', async () => {
     
    mockUserService.getUsers.mockRejectedValue('Some weird error');
    const consoleSpy = vi.spyOn(console, 'error');

    
    await userList({});

    
    expect(consoleSpy).toHaveBeenCalledWith('An unknown error occurred.');
  });
});