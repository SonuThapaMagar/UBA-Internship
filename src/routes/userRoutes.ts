import express from 'express';
import { UserController } from '../controller/UserController'
import { userValidation, validateUserId } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';

const router: express.Router = express.Router();
const controller = new UserController();

//Routes
router.post('/', userValidation, asyncHandler(controller.userCreate));
router.get('/', asyncHandler(controller.userList));
router.get('/:id', validateUserId, asyncHandler(controller.getUserById));
router.put('/:id', validateUserId, asyncHandler(controller.userUpdate));
router.delete('/:id', validateUserId, asyncHandler(controller.userDelete));

export default router;
