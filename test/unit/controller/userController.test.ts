import { describe, it, vi, beforeEach, expect } from 'vitest';
import { UserController } from '../../../src/controller/UserController';
import { UserService } from '../../../src/services/userService';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../../src/entity/User';
import { UserCreate, UserOptions } from '../../../src/types/User';

type MockUserService = {
  createUser: ReturnType<typeof vi.fn>;
  getUsers: ReturnType<typeof vi.fn>;
  getUserById: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
  deleteUser: ReturnType<typeof vi.fn>;
  login: ReturnType<typeof vi.fn>;
};

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: MockUserService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

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
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock service
    mockUserService = {
      createUser: vi.fn(),
      getUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      login: vi.fn()
    };

    // Create controller instance
    controller = new UserController(mockUserService as unknown as UserService);

    // Setup request mock
    req = {
      body: {},
      params: {},
      query: {}
    };

    // Setup response mock
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn()
    };

    // Setup next function mock
    next = vi.fn();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData: UserCreate = {
        fname: 'John',
        lname: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      req.body = userData;
      mockUserService.createUser.mockResolvedValue(mockUser);

      await controller.register(req as Request, res as Response, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors during user creation', async () => {
      const error = new Error('Email already exists');
      mockUserService.createUser.mockRejectedValue(error);

      await controller.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('userList', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      await controller.userList(req as Request, res as Response, next);

      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should filter users by query parameters', async () => {
      const query = { fname: 'John' };
      req.query = query;
      mockUserService.getUsers.mockResolvedValue([mockUser]);

      await controller.userList(req as Request, res as Response, next);

      expect(mockUserService.getUsers).toHaveBeenCalledWith(query);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = '1';
      req.params = { id: userId };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      await controller.getUserById(req as Request, res as Response, next);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle non-existent user', async () => {
      const error = new Error('User not found');
      req.params = { id: '999' };
      mockUserService.getUserById.mockRejectedValue(error);

      await controller.getUserById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };
      const mockToken = 'mock.jwt.token';
      req.body = credentials;
      mockUserService.login.mockResolvedValue(mockToken);

      await controller.login(req as Request, res as Response, next);

      expect(mockUserService.login).toHaveBeenCalledWith(credentials.email, credentials.password);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it('should handle missing credentials', async () => {
      req.body = {};

      await controller.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      req.body = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };
      mockUserService.login.mockRejectedValue(error);

      await controller.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
}); 