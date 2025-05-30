import express from 'express';
import { UserController } from '../controller/UserController';
import { userValidation, validateUserId, loginValidation, updateUserValidation } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserService } from '../services/userService';
import { authenticateToken, requireRole, checkOwnership } from '../middleware/auth';
import { UserRole } from '../../types/auth.types';
import { InternshipService } from '../services/internshipService';
import { InternshipController } from '../controller/InternshipController';

export const createUserRouter = () => {
    const router = express.Router();
    const userService = new UserService();
    const userController = new UserController(userService);
    const internshipService = new InternshipService();
    const internshipController = new InternshipController(internshipService);

    // Public routes
    router.post('/register', userValidation, asyncHandler(userController.register));
    router.post('/login', loginValidation, asyncHandler(userController.login));

    // Protected routes
    router.use(authenticateToken);

    // Admin-only routes
    router.get('/', requireRole([UserRole.ADMIN]), asyncHandler(userController.userList));
    router.post(
        '/:id/internship',
        requireRole([UserRole.ADMIN]),
        validateUserId,
        asyncHandler(internshipController.createInternship)
    );

    // User-specific routes
    router.get('/:id', checkOwnership, validateUserId, asyncHandler(userController.getUserById));
    router.put('/:id', checkOwnership, validateUserId, updateUserValidation, asyncHandler(userController.userUpdate));
    router.delete('/:id', checkOwnership, validateUserId, asyncHandler(userController.userDelete));
    router.get(
        '/:id/internship',
        checkOwnership,
        validateUserId,
        asyncHandler(internshipController.getInternships)
    );

    return router;
};