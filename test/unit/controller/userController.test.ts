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

  describe('createUser', () => {
    it('should create a new user and return 201', async () => {
      const mockUser = { id: '1', fname: 'John', lname: 'Doe', addresses: [] };
      mockUserService.createUser.mockResolvedValue(mockUser);
      req.body = { fname: 'John', lname: 'Doe' };

      await controller.createUser(req as Request, res as Response, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ fname: 'John', lname: 'Doe' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors by passing to next middleware', async () => {
      const error = new Error('Database error');
      mockUserService.createUser.mockRejectedValue(error);
      req.body = { fname: 'John', lname: 'Doe' };

      await controller.createUser(req as Request, res as Response, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ fname: 'John', lname: 'Doe' });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('userList', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { id: '1', fname: 'John', lname: 'Doe', addresses: [] },
        { id: '2', fname: 'Jane', lname: 'Smith', addresses: [] },
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
      const mockUser = { id: '1', fname: 'John', lname: 'Doe', addresses: [] };
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
      const mockUpdatedUser = { id: '1', fname: 'Johnny', lname: 'Doe', addresses: [] };
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

  describe('UserController Address Operations', () => {
    describe('createAddress', () => {
      it('should create address and return 201 status', async () => {
        const mockAddress = { id: '1', street: '123 Main St', user: { id: '1' } };
        mockUserService.createAddress.mockResolvedValue(mockAddress);
        req.params = { userId: '1' };
        req.body = { street: '123 Main St' };

        await controller.createAddress(req as Request, res as Response, next);

        expect(mockUserService.createAddress).toHaveBeenCalledWith('1', { street: '123 Main St' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockAddress);
        expect(next).not.toHaveBeenCalled();
      });

      it('should handle missing userId parameter', async () => {
        req.params = {};
        req.body = { street: '123 Main St' };

        await controller.createAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should handle service errors', async () => {
        const error = new Error('Database error');
        mockUserService.createAddress.mockRejectedValue(error);
        req.params = { userId: '1' };
        req.body = { street: '123 Main St' };

        await controller.createAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe('addressList', () => {
      it('should return addresses filtered by userId', async () => {
        const mockAddresses = [
          { id: '1', street: '123 Main St', user: { id: '1' } },
          { id: '2', street: '456 Oak St', user: { id: '1' } }
        ];
        mockUserService.getAddresses.mockResolvedValue(mockAddresses);
        req.query = { userId: '1' };

        await controller.addressList(req as Request, res as Response, next);

        expect(mockUserService.getAddresses).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAddresses);
      });

      it('should return all addresses when no userId provided', async () => {
        const mockAddresses = [
          { id: '1', street: '123 Main St', user: { id: '1' } },
          { id: '2', street: '456 Oak St', user: { id: '2' } }
        ];
        mockUserService.getAddresses.mockResolvedValue(mockAddresses);
        req.query = {};

        await controller.addressList(req as Request, res as Response, next);

        expect(mockUserService.getAddresses).toHaveBeenCalledWith(undefined);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAddresses);
      });

      it('should handle empty address list', async () => {
        mockUserService.getAddresses.mockResolvedValue([]);
        req.query = { userId: '1' };

        await controller.addressList(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith([]);
      });

      it('should handle service errors', async () => {
        const error = new Error('Database error');
        mockUserService.getAddresses.mockRejectedValue(error);
        req.query = { userId: '1' };

        await controller.addressList(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe('getAddressById', () => {
      it('should return address by ID with 200 status', async () => {
        const mockAddress = { id: '1', street: '123 Main St', user: { id: '1' } };
        mockUserService.getAddressById.mockResolvedValue(mockAddress);
        req.params = { id: '1' };

        await controller.getAddressById(req as Request, res as Response, next);

        expect(mockUserService.getAddressById).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAddress);
      });

      it('should handle missing address ID', async () => {
        req.params = {};

        await controller.getAddressById(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should handle address not found', async () => {
        const error = new Error('Address not found');
        mockUserService.getAddressById.mockRejectedValue(error);
        req.params = { id: '999' };

        await controller.getAddressById(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe('updateAddress', () => {
      it('should update address and return 200 status', async () => {
        const mockAddress = { id: '1', street: 'Updated St', user: { id: '1' } };
        mockUserService.updateAddress.mockResolvedValue(mockAddress);
        req.params = { id: '1' };
        req.body = { street: 'Updated St' };

        await controller.updateAddress(req as Request, res as Response, next);

        expect(mockUserService.updateAddress).toHaveBeenCalledWith('1', { street: 'Updated St' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAddress);
      });

      it('should handle missing address ID', async () => {
        req.params = {};
        req.body = { street: 'Updated St' };

        await controller.updateAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should handle invalid update data', async () => {
        req.params = { id: '1' };
        req.body = { invalidField: 'value' };

        await controller.updateAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe('deleteAddress', () => {
      it('should delete address and return 204 status', async () => {
        mockUserService.deleteAddress.mockResolvedValue(undefined);
        req.params = { id: '1' };

        await controller.deleteAddress(req as Request, res as Response, next);

        expect(mockUserService.deleteAddress).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
      });

      it('should handle missing address ID', async () => {
        req.params = {};

        await controller.deleteAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should handle address not found', async () => {
        const error = new Error('Address not found');
        mockUserService.deleteAddress.mockRejectedValue(error);
        req.params = { id: '999' };

        await controller.deleteAddress(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
      });
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