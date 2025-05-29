import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateToken, requireRole } from '../../src/middleware/auth';
import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../../src/types/auth.types';

// Define AuthRequest type for testing
interface AuthRequest extends Request {
    user?: {
        id: string;
        fname: string;
        email: string;
        role: UserRole;
    };
}

vi.mock('jsonwebtoken', () => ({
  verify: vi.fn(),
}));

describe('Auth Middleware', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Reset mocks before each test
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
        // Reset environment variable
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('authenticateToken', () => {
        it('should return 401 if no token is provided', () => {
            authenticateToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Access token is required',
                statusCode: 401,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 500 if JWT_SECRET is not defined', () => {
            delete process.env.JWT_SECRET;
            mockRequest.headers = { authorization: 'Bearer some-token' };

            authenticateToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'JWT_SECRET is not defined',
                statusCode: 500,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 if token is invalid', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            authenticateToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid or expired token',
                statusCode: 403,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next if token is valid', () => {
            mockRequest.headers = { authorization: 'Bearer valid-token' };
            const decoded = { id: '123', fname: 'John', email: 'john@example.com', role: UserRole.USER };
            (vi.mocked(jwt.verify) as any).mockReturnValue(decoded);

            authenticateToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
            expect((mockRequest as AuthRequest).user).toEqual(decoded);
            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('requireRole', () => {
        const adminMiddleware = requireRole([UserRole.ADMIN]);
        
        it('should return 403 if user is not authenticated', () => {
            mockRequest.user = undefined;

            adminMiddleware(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Insufficient permissions',
                statusCode: 403,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 if user role is not in allowed roles', () => {
            mockRequest.user = {
                id: '1',
                fname: 'John',
                email: 'john@example.com',
                role: UserRole.USER,
            };

            adminMiddleware(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Insufficient permissions',
                statusCode: 403,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next if user role is allowed', () => {
            mockRequest.user = {
                id: '1',
                fname: 'Admin',
                email: 'admin@example.com',
                role: UserRole.ADMIN,
            };

            adminMiddleware(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });
});