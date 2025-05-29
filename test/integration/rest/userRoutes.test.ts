import { vi, describe, it, expect, beforeEach } from 'vitest';
import express, { Router } from 'express';
import { createUserRouter } from '../../../src/routes/userRoutes';
import * as auth from '../../../src/middleware/auth';
import * as userValidation from '../../../src/middleware/userValidation';
import * as asyncHandler from '../../../src/middleware/asyncHandler';
import { UserController } from '../../../src/controller/UserController';
import { InternshipController } from '../../../src/controller/InternshipController';
import { UserRole } from '../../../src/types/auth.types';

// Mock dependencies
vi.mock('../../../src/controller/UserController');
vi.mock('../../../src/controller/InternshipController');
vi.mock('../../../src/middleware/userValidation');
vi.mock('../../../src/middleware/asyncHandler');
vi.mock('../../../src/middleware/auth');

describe('User Router', () => {
  let router: Router;
  const mockAsyncHandler = vi.fn((fn) => fn);
  const mockAuthenticateToken = vi.fn((req, res, next) => next());
  const mockRequireRole = vi.fn(() => (req: any, res: any, next: any) => next());
  const mockCheckOwnership = vi.fn((req, res, next) => next());
  const mockValidationHandler = vi.fn((req, res, next) => next());

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock middleware
    vi.spyOn(asyncHandler, 'asyncHandler').mockImplementation(mockAsyncHandler);
    vi.spyOn(auth, 'authenticateToken').mockImplementation(mockAuthenticateToken);
    vi.spyOn(auth, 'requireRole').mockImplementation(mockRequireRole);
    vi.spyOn(auth, 'checkOwnership').mockImplementation(mockCheckOwnership);

    // Mock validation middleware arrays
    vi.spyOn(userValidation, 'userValidation').mockReturnValue([mockValidationHandler]);
    vi.spyOn(userValidation, 'updateUserValidation').mockReturnValue([mockValidationHandler]);
    vi.spyOn(userValidation, 'validateUserId').mockReturnValue([mockValidationHandler]);
    vi.spyOn(userValidation, 'loginValidation').mockReturnValue([mockValidationHandler]);

    // Mock UserController methods
    const mockUserController = {
      register: vi.fn().mockImplementation(async (req, res) => res.json({})),
      login: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userList: vi.fn().mockImplementation(async (req, res) => res.json({})),
      getUserById: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userUpdate: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userDelete: vi.fn().mockImplementation(async (req, res) => res.json({}))
    };

    // Mock InternshipController methods
    const mockInternshipController = {
      createInternship: vi.fn().mockImplementation(async (req, res) => res.json({})),
      getInternships: vi.fn().mockImplementation(async (req, res) => res.json({}))
    };

    vi.mocked(UserController).mockImplementation(() => mockUserController as any);
    vi.mocked(InternshipController).mockImplementation(() => mockInternshipController as any);

    // Create router
    router = createUserRouter();
  });

  it('should configure public routes correctly', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    expect(routes).toContainEqual({
      path: '/register',
      methods: { post: true },
    });
    expect(routes).toContainEqual({
      path: '/login',
      methods: { post: true },
    });
  });

  it('should configure protected routes correctly', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    expect(routes).toContainEqual({ path: '/', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { put: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { delete: true } });
    expect(routes).toContainEqual({ path: '/:id/internship', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id/internship', methods: { post: true } });
  });

  it('should apply requireRole middleware to admin routes', () => {
    expect(mockRequireRole).toHaveBeenCalledWith([UserRole.ADMIN]);
  });

  it('should apply validation middleware to appropriate routes', () => {
    expect(userValidation.userValidation).toHaveBeenCalled();
    expect(userValidation.loginValidation).toHaveBeenCalled();
    expect(userValidation.updateUserValidation).toHaveBeenCalled();
    expect(userValidation.validateUserId).toHaveBeenCalled();
  });

  it('should apply checkOwnership middleware to user-specific routes', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    // Verify routes that use checkOwnership middleware
    expect(routes).toContainEqual({ path: '/:id', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { put: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { delete: true } });
    expect(routes).toContainEqual({ path: '/:id/internship', methods: { get: true } });
  });
});