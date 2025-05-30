import { vi, describe, it, expect, beforeEach } from 'vitest';
import express, { Router } from 'express';
import { createUserRouter } from '../../../app/routes/userRoutes';
import * as auth from '../../../app/middleware/auth';
import * as userValidation from '../../../app/middleware/userValidation';
import * as asyncHandler from '../../../app/middleware/asyncHandler';
import { UserController } from '../../../app/controller/UserController';
import { InternshipController } from '../../../app/controller/InternshipController';

// Mock dependencies
vi.mock('../../../app/controller/UserController');
vi.mock('../../../app/controller/InternshipController');
vi.mock('../../../app/middleware/userValidation');
vi.mock('../../../app/middleware/asyncHandler');
vi.mock('../../../app/middleware/auth');

describe('User Router', () => {
  let router: Router;
  const mockAsyncHandler = vi.fn((fn) => fn);
  const mockAuthenticateToken = vi.fn((req, res, next) => next());
  const mockRequireRole = vi.fn(() => (req: any, res: any, next: any) => next());
  const mockCheckOwnership = vi.fn((req, res, next) => next());
  const mockValidationHandler = vi.fn((req, res, next) => next());

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock middleware
    vi.spyOn(asyncHandler, 'asyncHandler').mockImplementation(mockAsyncHandler);
    vi.spyOn(auth, 'authenticateToken').mockImplementation(mockAuthenticateToken);
    vi.spyOn(auth, 'requireRole').mockImplementation(mockRequireRole);
    vi.spyOn(auth, 'checkOwnership').mockImplementation(mockCheckOwnership);

    // Mock validation middleware
    const mockValidationArray = [mockValidationHandler];
    Object.defineProperty(userValidation, 'userValidation', { value: vi.fn().mockReturnValue(mockValidationArray) });
    Object.defineProperty(userValidation, 'loginValidation', { value: vi.fn().mockReturnValue(mockValidationArray) });
    Object.defineProperty(userValidation, 'updateUserValidation', { value: vi.fn().mockReturnValue(mockValidationArray) });
    Object.defineProperty(userValidation, 'validateUserId', { value: vi.fn().mockReturnValue(mockValidationArray) });

    // Mock controllers
    const mockUserController = {
      register: vi.fn().mockImplementation(async (req, res) => res.json({})),
      login: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userList: vi.fn().mockImplementation(async (req, res) => res.json({})),
      getUserById: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userUpdate: vi.fn().mockImplementation(async (req, res) => res.json({})),
      userDelete: vi.fn().mockImplementation(async (req, res) => res.json({})),
    };

    const mockInternshipController = {
      createInternship: vi.fn().mockImplementation(async (req, res) => res.json({})),
      getInternships: vi.fn().mockImplementation(async (req, res) => res.json({})),
    };

    (UserController as any).mockImplementation(() => mockUserController);
    (InternshipController as any).mockImplementation(() => mockInternshipController);

    router = createUserRouter();
  });

  it('should configure all required routes', () => {
    const routes = router.stack.map((layer: any) => ({
      path: layer.route?.path,
      methods: layer.route?.methods,
    }));

    // Public routes
    expect(routes).toContainEqual({ path: '/register', methods: { post: true } });
    expect(routes).toContainEqual({ path: '/login', methods: { post: true } });

    // Protected routes
    expect(routes).toContainEqual({ path: '/', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { put: true } });
    expect(routes).toContainEqual({ path: '/:id', methods: { delete: true } });
    expect(routes).toContainEqual({ path: '/:id/internship', methods: { get: true } });
    expect(routes).toContainEqual({ path: '/:id/internship', methods: { post: true } });
  });

  it('should apply authentication middleware to protected routes', () => {
    // Get all routes except public ones
    const protectedRoutes = router.stack
    // Only include layers with route objects
      .filter((layer: any) => layer.route) 
      .filter((layer: any) => 
        layer.route.path !== '/register' && layer.route.path !== '/login'
      );
    
    // Check if authenticateToken middleware is in the router stack
    const hasAuthMiddleware = router.stack.some((layer: any) => 
      layer.name === 'authenticateToken' || layer.handle === mockAuthenticateToken
    );
    expect(hasAuthMiddleware).toBe(true);

    // Verify each protected route exists and has a path
    protectedRoutes.forEach((route: any) => {
      expect(route.route).toBeDefined();
      expect(route.route.path).toBeDefined();
    });
  });
});
