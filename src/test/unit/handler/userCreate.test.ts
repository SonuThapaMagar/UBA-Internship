import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { userCreate } from '../../../app/handler/userCreate';
import { UserService } from '../../../app/services/userService';
import { UserCreate } from '../../../types/User';

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

vi.mock('../../../app/services/userService', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    createUser: vi.fn()
  }))
}));

describe('userCreate handler', () => {
  let mockCreateUser: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCreateUser = vi.fn();
    (UserService as unknown as Mock).mockImplementation(() => ({
      createUser: mockCreateUser
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call createUser and log success message', async () => {
    const input: UserCreate = {
      fname: 'Jane',
      lname: 'Smith',
      email: 'jane@example.com',
      password: 'password123'
    };
    mockCreateUser.mockResolvedValue({ 
      id: '1', 
      fname: 'Jane', 
      lname: 'Smith', 
      email: 'jane@example.com',
      password: 'hashedpassword',
      role: 'user',
      internships: []
    });
    await userCreate(input);
    expect(mockCreateUser).toHaveBeenCalledWith(input);
  });
});