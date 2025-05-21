import express from 'express';
import { UserController } from '../controller/UserController';
import { userValidation, validateUserId, addressValidation } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserService } from '../services/userService';
import { authenticateToken } from '../middleware/auth';

export const createUserRouter = () => {
    const router: express.Router = express.Router();
    const userService = new UserService();
    const controller = new UserController(userService);

    // Public routes (no auth required)
    router.post('/login', asyncHandler(controller.login));
    router.post('/', userValidation, asyncHandler(controller.createUser));

    // Protected routes (auth required)
    router.use('/', authenticateToken); 

    // Address routes
    router.get('/addresses', asyncHandler(controller.addressList));
    router.get('/addresses/:id', validateUserId, asyncHandler(controller.getAddressById));
    router.put('/addresses/:id', validateUserId, addressValidation, asyncHandler(controller.updateAddress));
    router.delete('/addresses/:id', validateUserId, asyncHandler(controller.deleteAddress));

    // User routes
    router.get('/', asyncHandler(controller.userList));
    router.get('/:id', validateUserId, asyncHandler(controller.getUserById));
    router.put('/:id', validateUserId, asyncHandler(controller.userUpdate));
    router.delete('/:id', validateUserId, asyncHandler(controller.deleteAddress));
    router.post('/:userId/addresses', validateUserId, addressValidation, asyncHandler(controller.createAddress));

    return router;
};