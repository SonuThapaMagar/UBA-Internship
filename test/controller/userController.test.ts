import { describe, it, vi, beforeEach, expect } from 'vitest';
import { UserController } from '../../src/controller/UserController';
import { userService } from '../../src/services/userService';
import { send } from 'process';

vi.mock('../../src/services/userService', () => {
    return {
        userService: {
            createUser: vi.fn(),
            getUsers: vi.fn(),
            getUserById: vi.fn(),
            updateUser: vi.fn(),
            deleteUser: vi.fn()
        }
    }
});

describe('UserController', () => {
    let controller: UserController;
    let req: any;
    let res: any;

    beforeEach(() => {
        controller = new UserController();
        req = {};
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn(),
        };
        vi.clearAllMocks();
    });

    it('createUser: should create a new user', async () => {
        req.body = { name: 'John' };
        const mockUser = { id: '1', name: 'John' };

        (userService.createUser as any).mockResolvedValue(mockUser);

        await controller.createUser(req, res);

        expect(userService.createUser).toHaveBeenCalledWith({ name: 'John' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should get all the users', async () => {
        const mockUsers = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];
        (userService.getUsers as any).mockResolvedValue(mockUsers);

        await controller.userList(req, res);
        expect(userService.getUsers).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    })

    it('should get the users by id', async () => {
        const mockUser = { id: '1', name: 'John' };
        (userService.getUserById as any).mockResolvedValue(mockUser);

        req.params = { id: '1' };
        await controller.getUserById(req, res);

        expect(userService.getUserById).toHaveBeenCalled();
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);

    })

    it('should update the users by id', async () => {
        const mockUpdatedUser = { id: '1', name: 'Update name' };
        (userService.updateUser as any).mockResolvedValue(mockUpdatedUser);

        req.params = { id: '1' };
        req.body = { name: 'Updated Name' };

        await controller.userUpdate(req, res);

        expect(userService.updateUser).toHaveBeenCalledWith('1', { name: 'Updated Name' });
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);

    })

    it('should delete the users by id', async () => {
        (userService.deleteUser as any).mockResolvedValue(undefined);

        req.params = { id: '1' };

        await controller.userDelete(req, res);

        expect(userService.deleteUser).toHaveBeenCalledWith('1');
        expect(res.status).toBeCalledWith(204);
        expect(res.send).toHaveBeenCalled();

    })
});
