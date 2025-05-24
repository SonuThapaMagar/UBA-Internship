import { vi, describe, it, expect, beforeEach } from 'vitest';
import express, { Router } from 'express';
import { createUserRouter } from '../../../src/routes/userRoutes'; // Adjust path to your userRoutes.ts file
import * as auth from '../../../src/middleware/auth';
import * as userValidation from '../../../src/middleware/userValidation';
import * as asyncHandler from '../../../src/middleware/asyncHandler';
import { UserController } from '../../../src/controller/UserController';

// Mock dependencies
vi.mock('../controller/UserController');
vi.mock('../middleware/userValidation');
vi.mock('../middleware/asyncHandler');
vi.mock('../middleware/auth');

describe('User Router', () => {
  let router: Router;
  const mockAsyncHandler = vi.fn((fn) => fn);
  const mockAuthenticateToken = vi.fn((req, res, next) => next());
  const mockRequireRole = vi.fn(() => (req: any, res: any, next: any) => next());
  const mockUserValidation = vi.fn((req, res, next) => next());
  const mockValidateUserId = vi.fn((req, res, next) => next());
  const mockAddressValidation = vi.fn((req, res, next) => next());

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock middleware
    vi.spyOn(asyncHandler, 'asyncHandler').mockImplementation(mockAsyncHandler);
    vi.spyOn(auth, 'authenticateToken').mockImplementation(mockAuthenticateToken);
    vi.spyOn(auth, 'requireRole').mockImplementation(mockRequireRole);
    vi.spyOn(userValidation, 'userValidation').mockImplementation(mockUserValidation);
    vi.spyOn(userValidation, 'validateUserId').mockImplementation(mockValidateUserId);
    vi.spyOn(userValidation, 'addressValidation').mockImplementation(mockAddressValidation);

    // Mock UserController methods
    vi.spyOn(UserController.prototype, 'login').mockImplementation(async (req, res) => {{res.json({})}});
    vi.spyOn(UserController.prototype, 'createUser').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'addressList').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'getAddressById').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'updateAddress').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'deleteAddress').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'userList').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'getUserById').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'userUpdate').mockImplementation(async (req, res) => {res.json({})});
    vi.spyOn(UserController.prototype, 'createAddress').mockImplementation(async (req, res) => {res.json({})});

    // Create router
    router = createUserRouter();
  });

  it('should configure public routes correctly', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    expect(routes).toContainEqual({
      path: '/login',
      methods: { post: true },
    });
    expect(routes).toContainEqual({
      path: '/',
      methods: { post: true },
    });
  });

  it('should configure protected routes correctly', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    expect(routes).toContainEqual({ path: '/addresses', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { put: true } });
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { delete: true } });
    expect(routes).toContainEqual({ path: '/admin', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { put: true } });
    expect(routes).toContainEqual({ path: '/:userId/addresses', methods: { post: true } });
  });

  it('should apply requireRole middleware to admin route', () => {
    expect(mockRequireRole).toHaveBeenCalledWith(['admin']);
  });

  it('should apply validation middleware to appropriate routes', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    // Verify routes that use validation middleware exist
    expect(routes).toContainEqual({ path: '/', methods: { post: true } }); // userValidation
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { get: true } }); // validateUserId
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { put: true } }); // validateUserId, addressValidation
    expect(routes).toContainEqual({ path: '/addresses/:id', methods: { delete: true } }); // validateUserId
    expect(routes).toContainEqual({ path: '/:id', methods: { get: true } }); // validateUserId
    expect(routes).toContainEqual({ path: '/:id', methods: { put: true } }); // validateUserId
    expect(routes).toContainEqual({ path: '/:userId/addresses', methods: { post: true } }); // validateUserId, addressValidation
  });
});