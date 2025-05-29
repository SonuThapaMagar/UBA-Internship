import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../../src/services/userService';
import { User } from '../../../src/entity/User';
import { AppDataSource } from '../../../src/data/mysql';
import { UserOptions } from '../../../src/types/User';
import bcrypt from 'bcrypt';
import { Internship } from '../../../src/entity/Internship';

// environment variable for tests
process.env.JWT_SECRET = 'test-secret-key';

vi.mock('../../../src/data/mysql', () => {
  const mockUserRepo = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    merge: vi.fn(),
    remove: vi.fn(),
    query: vi.fn(),
  };
  
  return {
    AppDataSource: {
      getRepository: vi.fn().mockImplementation((entity) => {
        if (entity === User) return mockUserRepo;
        if (entity === Internship) return { delete: vi.fn() };
        return {};
      }),
    },
  };
});

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: any;
  let internRepoMock: any;

  const mockUser: User = {
    id: '1',
    fname: 'John',
    lname: 'Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: 'user',
    internships: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepo = AppDataSource.getRepository(User);
    internRepoMock = AppDataSource.getRepository(Internship);
    userService = new UserService();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [mockUser];
      mockUserRepo.find.mockResolvedValue(mockUsers);
      const result = await userService.getUsers();
      expect(result).toEqual(mockUsers);
      expect(mockUserRepo.find).toHaveBeenCalledWith({ 
        where: {},
        relations: ['internships']
      });
    });

    it('should pass options to find', async () => {
      const options = { fname: 'John' };
      const mockUsers = [mockUser];
      mockUserRepo.find.mockResolvedValue(mockUsers);
      const result = await userService.getUsers(options);
      expect(result).toEqual(mockUsers);
      expect(mockUserRepo.find).toHaveBeenCalledWith({ 
        where: options,
        relations: ['internships']
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      const result = await userService.getUserById('1');
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['internships']
      });
    });

    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(userService.getUserById('999')).rejects.toThrow('User with ID 999 not found');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
        relations: ['internships']
      });
    });
  });

  describe('createUser', () => {
    it('should create and save a user', async () => {
      const input = { 
        fname: 'Jane', 
        lname: 'Doe',
        email: 'jane@example.com',
        password: 'password123'
      };
      const newUser = { ...mockUser, ...input };
      mockUserRepo.create.mockReturnValue(newUser);
      mockUserRepo.save.mockResolvedValue(newUser);
      const result = await userService.createUser(input);
      expect(result).toEqual(newUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        fname: input.fname,
        lname: input.lname,
        email: input.email
      }));
      expect(mockUserRepo.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw error if email already exists', async () => {
      const input = { 
        fname: 'Jane', 
        lname: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(userService.createUser(input)).rejects.toThrow('Email already in use');
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const input = { fname: 'John Updated' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.merge.mockImplementation((user: User, updates: UserOptions) => {
        Object.assign(user, updates);
        return user;
      });
      mockUserRepo.save.mockResolvedValue(mockUser);
      const result = await userService.updateUser('1', input);
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockUserRepo.merge).toHaveBeenCalledWith(mockUser, input);
      expect(mockUserRepo.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(userService.updateUser('999', { fname: 'Test' })).rejects.toThrow(
        'User with ID 999 not found',
      );
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });

    it('should hash password when updating', async () => {
      const input = { password: 'newpassword123' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.merge.mockImplementation((user: User, updates: UserOptions) => {
        Object.assign(user, updates);
        return user;
      });
      mockUserRepo.save.mockResolvedValue(mockUser);
      const result = await userService.updateUser('1', input);
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.merge).toHaveBeenCalledWith(mockUser, expect.objectContaining({
        password: expect.not.stringMatching('newpassword123')
      }));
    });

    it('should throw error if new email already exists', async () => {
      const input = { email: 'existing@example.com' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser).mockResolvedValueOnce({ ...mockUser, id: '2' });
      await expect(userService.updateUser('1', input)).rejects.toThrow('Email already in use');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return it', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      internRepoMock.delete = vi.fn().mockResolvedValue(undefined);
      mockUserRepo.remove.mockResolvedValue(undefined);
      const result = await userService.deleteUser('1');
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(internRepoMock.delete).toHaveBeenCalledWith({ userId: '1' });
      expect(mockUserRepo.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(userService.deleteUser('999')).rejects.toThrow('User with ID 999 not found');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });


  describe('login', () => {
    it('should login user and return token', async () => {
      const mockUser = {
        id: '1',
        fname: 'John',
        lname: 'Doe',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      
      const result = await userService.login('test@example.com', 'password123');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should throw error for invalid credentials', async () => {
      const mockUser = {
        id: '1',
        fname: 'John',
        lname: 'Doe',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      
      await expect(userService.login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error for non-existent user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      
      await expect(userService.login('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});