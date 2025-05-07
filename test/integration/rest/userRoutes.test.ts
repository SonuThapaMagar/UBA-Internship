import request from 'supertest';
import express from 'express';
import userRoutes from '../../../src/routes/userRoutes';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const app = express();
app.use(express.json());
app.use('/api/users/', userRoutes);

describe('User Route', () => {
    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const userData = {
                fname: 'Test',
                lname: 'User'
            };
            const res = await request(app)
                .post('/api/users')
                .send(userData);

            console.log('Response:', res.status, res.body);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');

        },10000);


    })
})

