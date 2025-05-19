import express from 'express';
import { UserController } from '../controller/UserController';
import { userValidation, validateUserId, addressValidation } from '../middleware/userValidation';
import { asyncHandler } from '../middleware/asyncHandler';

const router: express.Router = express.Router();
const controller = new UserController();

// Address routes
router.get('/addresses', asyncHandler(controller.addressList));
router.get('/addresses/:id', validateUserId, asyncHandler(controller.getAddressById));
router.put('/addresses/:id', validateUserId, addressValidation, asyncHandler(controller.updateAddress));
router.delete('/addresses/:id', validateUserId, asyncHandler(controller.deleteAddress));

// User routes
router.post('/', userValidation, asyncHandler(controller.createUser));
router.get('/', asyncHandler(controller.userList));
router.get('/:id', validateUserId, asyncHandler(controller.getUserById));
router.put('/:id', validateUserId, asyncHandler(controller.userUpdate));
router.delete('/:id', validateUserId, asyncHandler(controller.userDelete));
router.post('/:userId/addresses', validateUserId, addressValidation, asyncHandler(controller.createAddress));

export default router;