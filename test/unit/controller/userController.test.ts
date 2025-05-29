import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';
import { UserController } from '../../../src/controller/UserController';
import { UserService } from '../../../src/services/userService';
import { Request, Response, NextFunction } from 'express';

type MockUserService = {
  createUser: ReturnType<typeof vi.fn>;
  getUsers: ReturnType<typeof vi.fn>;
  getUserById: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
  deleteUser: ReturnType<typeof vi.fn>;
  createAddress: ReturnType<typeof vi.fn>;
  getAddresses: ReturnType<typeof vi.fn>;
  getAddressById: ReturnType<typeof vi.fn>;
  updateAddress: ReturnType<typeof vi.fn>;
  deleteAddress: ReturnType<typeof vi.fn>;
  login: ReturnType<typeof vi.fn>;
};

describe('UserController', () => {
  let controller: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockUserService: MockUserService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserService = {
      createUser: vi.fn(),
      getUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      createAddress: vi.fn(),
      getAddresses: vi.fn(),
      getAddressById: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
      login: vi.fn()
    };
    controller = new UserController(mockUserService as unknown as UserService);
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register user', () => {
    it('should create a new user and return 201', async () => {
      const mockUser = { id: '1', fname: 'John', lname: 'Doe', };
      mockUserService.createUser.mockResolvedValue(mockUser);
      req.body = { fname: 'John', lname: 'Doe' };

      await controller.register(req as Request, res as Response, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ fname: 'John', lname: 'Doe' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('Database error');
      mockUserService.createUser.mockRejectedValue(error);
      req.body = { fname: 'John', lname: 'Doe' };

      await controller.register(req as Request, res as Response, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ fname: 'John', lname: 'Doe' });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('userList', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { id: '1', fname: 'John', lname: 'Doe', },
        { id: '2', fname: 'Jane', lname: 'Smith', },
      ];
      mockUserService.getUsers.mockResolvedValue(mockUsers);
      req.query = { fname: 'John' };

      await controller.userList(req as Request, res as Response, next);

      expect(mockUserService.getUsers).toHaveBeenCalledWith({ fname: 'John' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('Database error');
      mockUserService.getUsers.mockRejectedValue(error);
      req.query = { fname: 'John' };

      await controller.userList(req as Request, res as Response, next);

      expect(mockUserService.getUsers).toHaveBeenCalledWith({ fname: 'John' });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user by ID with status 200', async () => {
      const mockUser = { id: '1', fname: 'John', lname: 'Doe', };
      mockUserService.getUserById.mockResolvedValue(mockUser);
      req.params = { id: '1' };

      await controller.getUserById(req as Request, res as Response, next);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('User not found');
      mockUserService.getUserById.mockRejectedValue(error);
      req.params = { id: '1' };

      await controller.getUserById(req as Request, res as Response, next);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('userUpdate', () => {
    it('should update user and return 200', async () => {
      const mockUpdatedUser = { id: '1', fname: 'Johnny', lname: 'Doe', };
      mockUserService.updateUser.mockResolvedValue(mockUpdatedUser);
      req.params = { id: '1' };
      req.body = { fname: 'Johnny' };

      await controller.userUpdate(req as Request, res as Response, next);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', { fname: 'Johnny' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('User not found');
      mockUserService.updateUser.mockRejectedValue(error);
      req.params = { id: '1' };
      req.body = { fname: 'Johnny' };

      await controller.userUpdate(req as Request, res as Response, next);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', { fname: 'Johnny' });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('userDelete', () => {
    it('should delete user and return 204', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);
      req.params = { id: '1' };

      await controller.userDelete(req as Request, res as Response, next);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('User not found');
      mockUserService.deleteUser.mockRejectedValue(error);
      req.params = { id: '1' };

      await controller.userDelete(req as Request, res as Response, next);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const mockToken = 'mock.jwt.token';
      mockUserService.login.mockResolvedValue(mockToken);
      req.body = { email: 'test@example.com', password: 'password123' };

      await controller.login(req as Request, res as Response, next);

      expect(mockUserService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      mockUserService.login.mockRejectedValue(error);
      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      await controller.login(req as Request, res as Response, next);

      expect(mockUserService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle missing credentials', async () => {
      req.body = {};

      await controller.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
}); 