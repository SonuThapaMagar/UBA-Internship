import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { UserService } from '../services/userService';
import { validateRefreshToken, validateAddressId, validateUserId, validateLoginCredentials } from '../validators/userValidators';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken, requireRole } from '../middleware/auth';

export function createUserRouter(): Router {
    const router = Router();
    const userService = new UserService();
    const userController = new UserController(userService);

    // Public routes (no auth required)
    router.post('/login', validateLoginCredentials, asyncHandler(userController.login));
    router.post('/refresh-token', validateRefreshToken, asyncHandler(userController.refreshToken));
    router.post('/', userController.createUser);

    // Protected routes (auth required)
    router.use(authenticateToken);

    // Admin-only routes
    router.get('/admin', requireRole(['admin']), asyncHandler(userController.userList));
    router.get('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(userController.getUserById));
    router.put('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(userController.userUpdate));
    router.delete('/admin/:id', requireRole(['admin']), validateUserId, asyncHandler(userController.deleteAddress));

    // User routes
    router.get('/', userController.userList);
    router.get('/:id', validateUserId, userController.getUserById);
    router.put('/:id', validateUserId, userController.userUpdate);
    router.delete('/:id', validateUserId, userController.userDelete);

    // Address routes
    router.post('/:userId/addresses', validateUserId, userController.createAddress);
    router.get('/addresses', userController.addressList);
    router.get('/addresses/:id', validateAddressId, userController.getAddressById);
    router.put('/addresses/:id', validateAddressId, userController.updateAddress);
    router.delete('/addresses/:id', validateAddressId, userController.deleteAddress);

    return router;
}