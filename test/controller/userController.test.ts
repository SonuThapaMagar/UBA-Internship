import { describe, it, vi, beforeEach, expect } from 'vitest';
import { UserController } from '../../src/controller/UserController';
import { userService } from '../../src/services/userService';

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
            json: vi.fn()
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
});
