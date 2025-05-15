import request from 'supertest';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// mocks controller
const mockController = {
    createUser: vi.fn(),
    userList: vi.fn(),
    getUserById: vi.fn(),
    userUpdate: vi.fn(),
    userDelete: vi.fn(),
};

const mockUserValidation = vi.fn((_req: Request, _res: Response, next: NextFunction) => next());
const mockValidateUserId = vi.fn((_req: Request, _res: Response, next: NextFunction) => next());

//modules mock
vi.mock('../../../src/controller/UserController', () => ({
    UserController: vi.fn(() => mockController),
    default: vi.fn(() => mockController),
}));

vi.mock('../../../src/middleware/userValidation', () => ({
    userValidation: mockUserValidation,
    validateUserId: mockValidateUserId,
}));

vi.mock('../../../src/middleware/asyncHandler', () => ({
    asyncHandler: (fn: any) => fn,
}));

describe('User routes', () => {
    let app: express.Express;
    let server: ReturnType<typeof app.listen>;
    let userRoutes: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        userRoutes = (await import('../../../src/routes/userRoutes')).default;
        app = express();
        app.use(express.json());
        app.use('/users', userRoutes);

        server = app.listen(3000 + Math.floor(Math.random() * 1000));
    });

    afterEach(() => {
        server.close();
    });

    describe('POST /users', () => {
        it('should call createUser with validation', async () => {
            const mockUser = { fname: 'John', lname: 'Doe' };
            mockController.createUser.mockImplementation((_req: Request, res: Response) =>
                res.status(201).json({ id: '1', ...mockUser })
            );

            const response = await request(app)
                .post('/users')
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: '1', ...mockUser });
            expect(mockUserValidation).toHaveBeenCalled();
            expect(mockController.createUser).toHaveBeenCalled();
        });

        it('should return 400 if validation fails', async () => {
            mockUserValidation.mockImplementationOnce((_req: Request, res: Response, _next: NextFunction) => {
                res.status(400).json({ error: 'Validation failed' });
            });

            const response = await request(app)
                .post('/users')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Validation failed' });
            expect(mockController.createUser).not.toHaveBeenCalled();
        });
    });

    describe('GET /users', () => {
        it('should return user list', async () => {
            const mockUsers = [{ id: '1', fname: 'John' }, { id: '2', fname: 'Jane' }];
            mockController.userList.mockImplementation((_req: Request, res: Response) =>
                res.status(200).json(mockUsers)
            );

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        })
    })

    describe('GET /users/:id', () => {
        it('should return user by ID', async () => {
            const mockUser = { id: '1', fname: 'John' };
            mockController.getUserById.mockImplementation((_req: Request, res: Response) =>
                res.status(200).json(mockUser)
            );

            const response = await request(app).get('/users/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(mockValidateUserId).toHaveBeenCalled();
        })

        it('should return 404 if user not found', async () => {
            mockController.getUserById.mockImplementation((_req: Request, res: Response) =>
                res.status(404).json({ error: 'User not found' })
            );

            const response = await request(app).get('/users/999');
            expect(response.status).toBe(404);
        });
    })

    describe('PUT /users/:id', () => {
        it('should update user', async () => {
            const updatedUser = { fname: 'Johnny' }
            mockController.userUpdate.mockImplementation((_req: Request, res: Response) =>
                res.status(200).json({ id: '1', ...updatedUser })
            )

            const response = await request(app)
                .put('/users/1')
                .send(updatedUser);

            expect(response.status).toBe(200);
            expect(mockValidateUserId).toHaveBeenCalled();
        })
    })

    describe('DELETE /users/:id', () => {
        it('should delete the user', async () => {
            mockController.userDelete.mockImplementation((_req: Request, res: Response) => {
                res.status(204).send();
            })

            const response = await request(app).delete('/users/1');
            expect(response.status).toBe(204);
            expect(mockValidateUserId).toHaveBeenCalled();
        })
    })

});