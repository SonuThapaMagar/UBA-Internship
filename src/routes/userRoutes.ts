import express from 'express';
import { UserController } from '../controller/UserController';
import { userValidation, validateUserId, addressValidation } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserService } from '../services/userService';
import { authenticateToken, requireRole } from '../middleware/auth';

export const createUserRouter = () => {
    const router = express.Router();
    const userService = new UserService();
    const controller = new UserController(userService);

    // Public routes (no auth required)
    router.post('/login', asyncHandler(controller.login));
    router.post('/refresh-token', asyncHandler(controller.refreshToken));
    router.post('/', userValidation, asyncHandler(controller.createUser));

    // Protected routes (auth required)
    router.use(authenticateToken);

    // Admin-only routes
    router.get('/admin', requireRole(['admin']), asyncHandler(controller.userList));
    router.get('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(controller.getUserById));
    router.put('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(controller.userUpdate));
    router.delete('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(controller.deleteAddress));

    // User routes
    router.get('/', asyncHandler(controller.userList));
    router.get('/:id', validateUserId, asyncHandler(controller.getUserById));
    router.put('/:id', validateUserId, asyncHandler(controller.userUpdate));
    router.delete('/:id', validateUserId, asyncHandler(controller.deleteAddress));
    router.post('/:userId/addresses', validateUserId, addressValidation, asyncHandler(controller.createAddress));

    // Address routes
    router.get('/addresses', asyncHandler(controller.addressList));
    router.get('/addresses/:id', validateUserId, asyncHandler(controller.getAddressById));
    router.put('/addresses/:id', validateUserId, addressValidation, asyncHandler(controller.updateAddress));
    router.delete('/addresses/:id', validateUserId, asyncHandler(controller.deleteAddress));

    return router;
};