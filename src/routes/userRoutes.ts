import express from 'express';
import { UserController } from '../controller/UserController'
import { userValidation, validateUserId } from '../middleware/userValidation';

const router: express.Router = express.Router();
const controller = new UserController();

//Routes
router.post('/', userValidation, controller.userCreate);
router.get('/', controller.userList);
router.get('/:id', validateUserId, controller.getUserById);
router.put('/:id', validateUserId, controller.userUpdate);
router.delete('/:id', validateUserId, controller.userDelete);

export default router;
