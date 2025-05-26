import express from 'express';
import { UserController } from '../controller/UserController';
import { userValidation, validateUserId, addressValidation } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserService } from '../services/userService';
import { authenticateToken, requireRole, checkOwnership } from '../middleware/auth';
import { UserRole } from '../types/auth.types';

export const createUserRouter = () => {
    const router = express.Router();
    const userService = new UserService();
    const controller = new UserController(userService);

    // Public routes
    router.post('/login', asyncHandler(controller.login));
    router.post('/', authenticateToken, requireRole([UserRole.ADMIN]), userValidation, asyncHandler(controller.createUser));
    // Protected routes
    router.use(authenticateToken);

    // Admin only routes
    router.get('/', requireRole([UserRole.ADMIN]), asyncHandler(controller.userList));
    router.get('/admin', requireRole([UserRole.ADMIN]), asyncHandler(controller.userList));
    // User routes
    router.get('/:id', checkOwnership, validateUserId, asyncHandler(controller.getUserById));
    router.put('/:id', checkOwnership, validateUserId, asyncHandler(controller.userUpdate));
    router.delete('/:id', checkOwnership, validateUserId, asyncHandler(controller.userDelete));

    // Address routes
    router.get('/:userId/addresses', checkOwnership, validateUserId, asyncHandler(controller.addressList));
    router.get('/:userId/addresses/:id', checkOwnership, validateUserId, asyncHandler(controller.getAddressById));
    router.post('/:userId/addresses', checkOwnership, validateUserId, addressValidation, asyncHandler(controller.createAddress));
    router.put('/:userId/addresses/:id', checkOwnership, validateUserId, addressValidation, asyncHandler(controller.updateAddress));
    router.delete('/:userId/addresses/:id', checkOwnership, validateUserId, asyncHandler(controller.deleteAddress));

    return router;
};

