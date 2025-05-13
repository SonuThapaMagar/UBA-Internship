import { describe, it, vi, expect, beforeEach } from 'vitest';
import { UserService } from '../../../src/services/userService';
import User from '../../../src/data/models/User.models';
import { UserCreate, UserOptions } from '../../../src/types/User';

// Define the type for the mocked User model to match Mongoose's interface
interface MockUserModel {
  new (data: UserCreate): {
    _id: string;
    fname: string;
    lname: string;
    save: () => Promise<any>;
    toObject: () => any;
  };
  find: () => { lean: () => any };
  findById: () => { lean: () => any };
  findByIdAndUpdate: () => { lean: () => any };
  findByIdAndDelete: () => { lean: () => any };
  lean: () => any;
}

// Create a mock user instance that will be returned by the mocked constructor
const mockUserInstance = {
  _id: '507f1f77bcf86cd799439011',
  fname: 'John',
  lname: 'Doe',
  save: vi.fn().mockResolvedValue({
    _id: '507f1f77bcf86cd799439011',
    fname: 'John',
    lname: 'Doe',
    toObject: vi.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      fname: 'John',
      lname: 'Doe',
    }),
  }),
  toObject: vi.fn().mockReturnValue({
    _id: '507f1f77bcf86cd799439011',
    fname: 'John',
    lname: 'Doe',
  }),
};

// Mock the User model
vi.mock('../../../src/data/models/User.models', () => {
  // Mock constructor function with proper typing
  const MockUser = vi.fn().mockImplementation(() => mockUserInstance) as unknown as MockUserModel;

  // Attach static methods to the constructor
  MockUser.find = vi.fn().mockReturnThis();
  MockUser.findById = vi.fn().mockReturnThis();
  MockUser.findByIdAndUpdate = vi.fn().mockReturnThis();
  MockUser.findByIdAndDelete = vi.fn().mockReturnThis();
  MockUser.lean = vi.fn();

  return {
    default: MockUser, // Export the constructor as default
  };
});

const mockUserDoc = {
  _id: '507f1f77bcf86cd799439011',
  fname: 'John',
  lname: 'Doe',
  toObject: () => ({
    _id: '507f1f77bcf86cd799439011',
    fname: 'John',
    lname: 'Doe',
  }),
};

describe('UserService', () => {
  const service = new UserService();

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
  });

  it('should return user list', async () => {
    (User.find as any).mockReturnValueOnce({
      lean: () => [
        { _id: '1', fname: 'John', lname: 'Doe' },
        { _id: '2', fname: 'Jane', lname: 'Smith' },
      ],
    });

    const result = await service.getUsers();
    expect(result).toEqual([
      { id: '1', _id: '1', fname: 'John', lname: 'Doe' },
      { id: '2', _id: '2', fname: 'Jane', lname: 'Smith' },
    ]);
  });

  it('should return user by id', async () => {
    (User.findById as any).mockReturnValueOnce({
      lean: () => ({
        _id: '507f1f77bcf86cd799439011',
        fname: 'John',
        lname: 'Doe',
      }),
    });

    const result = await service.getUserById('507f1f77bcf86cd799439011');
    expect(result).toEqual({
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      fname: 'John',
      lname: 'Doe',
    });
  });

  it('should update the user', async () => {
    const updatedData = {
      fname: 'Updated',
      lname: 'User',
    };
    (User.findByIdAndUpdate as any).mockReturnValueOnce({
      lean: () => ({
        _id: '507f1f77bcf86cd799439011',
        ...updatedData,
      }),
    });

    const result = await service.updateUser('507f1f77bcf86cd799439011', updatedData);
    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      _id: '507f1f77bcf86cd799439011',
      fname: 'Updated',
      lname: 'User',
    });
  });

  it('should throw an error if update user not found', async () => {
    (User.findByIdAndUpdate as any).mockReturnValueOnce({
      lean: () => null,
    });

    await expect(service.updateUser('nonexistent-id', { fname: 'Test' })).rejects.toThrow(
      'User not found'
    );
  });

  it('should throw error if user not found', async () => {
    (User.findById as any).mockReturnValueOnce({
      lean: () => null,
    });
    await expect(service.getUserById('not-found-id')).rejects.toThrow('User not found');
  });

  it('should delete the user', async () => {
    (User.findByIdAndDelete as any).mockReturnValueOnce({
      lean: () => ({
        _id: '507f1f77bcf86cd799439011',
        fname: 'Deleted',
        lname: 'User',
      }),
    });

    const result = await service.deleteUser('507f1f77bcf86cd799439011');
    expect(result).toEqual({
      id: '507f1f77bcf86cd799439011',
      _id: '507f1f77bcf86cd799439011',
      fname: 'Deleted',
      lname: 'User',
    });
  });

  it('should throw an error if delete user not found', async () => {
    (User.findByIdAndDelete as any).mockReturnValueOnce({
      lean: () => null,
    });

    await expect(service.deleteUser('invalid-id')).rejects.toThrow('User not found');
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData: UserCreate = {
        fname: 'John',
        lname: 'Doe',
      };

      const result = await service.createUser(userData);

      expect(User).toHaveBeenCalledWith(userData); // Verify constructor called with userData
      expect(mockUserInstance.save).toHaveBeenCalled(); // Verify save was called
      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        _id: '507f1f77bcf86cd799439011',
        fname: 'John',
        lname: 'Doe',
      });
    });

    it('should throw an error if user creation fails', async () => {
      const userData: UserCreate = {
        fname: 'John',
        lname: 'Doe',
      };

      // Mock save to throw an error
      mockUserInstance.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.createUser(userData)).rejects.toThrow('Database error');
      expect(User).toHaveBeenCalledWith(userData); 
      expect(mockUserInstance.save).toHaveBeenCalled(); 
    });
  });
});