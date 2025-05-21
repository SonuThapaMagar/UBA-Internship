import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createUserRouter } from '../../../src/routes/userRoutes';

// Mock the auth middleware
vi.mock('../../../src/middleware/auth', () => ({
    authenticateToken: vi.fn((req, res, next) => next())
}));

// Mock the validation middleware
vi.mock('../../../src/middleware/userValidation', () => ({
    validateUserId: vi.fn((req, res, next) => next()),
    userValidation: vi.fn((req, res, next) => next()),
    addressValidation: vi.fn((req, res, next) => next())
}));

// Mock the UserController
vi.mock('../../../src/controller/UserController', () => {
    const mockController = {
        createUser: vi.fn((req, res) => res.status(201).json({ id: '1', ...req.body })),
        login: vi.fn((req, res) => res.status(200).json({ token: 'mock.jwt.token' })),
        userList: vi.fn((req, res) => res.status(200).json([{ id: '1', fname: 'John' }])),
        getUserById: vi.fn((req, res) => res.status(200).json({ id: req.params.id, fname: 'John' })),
        userUpdate: vi.fn((req, res) => res.status(200).json({ id: req.params.id, ...req.body })),
        userDelete: vi.fn((req, res) => res.status(204).send()),
        deleteAddress: vi.fn((req, res) => res.status(204).send())
    };
    return {
        UserController: vi.fn(() => mockController),
    };
});

describe('User Routes', () => {
    let app: express.Express;
    let server: any;

    beforeEach(() => {
        vi.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/users', createUserRouter());
        server = app.listen(3001);
    });

    afterEach(() => {
        server.close();
    });

    it('should create a user', async () => {
        const mockUser = { fname: 'John', lname: 'Doe' };
        const response = await request(app)
            .post('/users')
            .send(mockUser);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: '1', ...mockUser });
    });

    it('should login a user', async () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        const response = await request(app)
            .post('/users/login')
            .send(credentials);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ token: 'mock.jwt.token' });
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: '1', fname: 'John' }]);
    });

    it('should get user by id', async () => {
        const response = await request(app)
            .get('/users/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '1', fname: 'John' });
    });

    it('should update user', async () => {
        const updateData = { fname: 'Johnny' };
        const response = await request(app)
            .put('/users/1')
            .send(updateData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '1', ...updateData });
    });

    it('should delete user', async () => {
        const response = await request(app)
            .delete('/users/1');
        expect(response.status).toBe(204);
    });
}); 