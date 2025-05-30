import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userList } from '../../../app/handler/userList';
import { UserService } from '../../../app/services/userService';
import { User } from '../../../types/User';

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

const mockGetUsers = vi.fn();
vi.mock('../../../app/services/userService', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getUsers: mockGetUsers
  }))
}));

describe('userList Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display users when found', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        fname: 'John',
        lname: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user',
        internships: []
      },
      {
        id: '2',
        fname: 'Jane',
        lname: 'Smith',
        email: 'jane@example.com',
        password: 'hashedpassword',
        role: 'user',
        internships: []
      }
    ];

    mockGetUsers.mockResolvedValue(mockUsers);

    await userList({});

    expect(mockGetUsers).toHaveBeenCalledWith({});
    expect(mockConsoleLog).toHaveBeenCalledWith('Users:');
    expect(mockConsoleLog).toHaveBeenCalledWith('ID: 1, Name: John Doe');
    expect(mockConsoleLog).toHaveBeenCalledWith('ID: 2, Name: Jane Smith');
  });

  it('should handle empty user list', async () => {
    mockGetUsers.mockResolvedValue([]);

    await userList({});

    expect(mockGetUsers).toHaveBeenCalledWith({});
    expect(mockConsoleLog).toHaveBeenCalledWith('No users found.');
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Database connection failed');
    mockGetUsers.mockRejectedValue(error);

    await userList({});

    expect(mockGetUsers).toHaveBeenCalledWith({});
    expect(mockConsoleError).toHaveBeenCalledWith('Error reading users:', 'Database connection failed');
  });

  it('should pass options to getUsers', async () => {
    const options = { fname: 'John' };
    mockGetUsers.mockResolvedValue([]);

    await userList(options);

    expect(mockGetUsers).toHaveBeenCalledWith(options);
  });
});
