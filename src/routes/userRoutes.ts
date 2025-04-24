import express from 'express';
import { UserController } from '../controller/userController'

const router: express.Router = express.Router();
const controller = new UserController();

//Routes
router.post('/', controller.userCreate);
router.get('/', controller.userList);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.userUpdate);
router.delete('/:id', controller.userDelete);

export default router;