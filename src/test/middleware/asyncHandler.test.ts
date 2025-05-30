import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../app/middleware/asyncHandler';

describe('Async Handler Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });

    it('should handle async functions successfully', async () => {
        const mockAsyncFunction = async (req: Request, res: Response) => {
            res.json({ success: true });
        };

        const handler = asyncHandler(mockAsyncFunction);
        await handler(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith({ success: true });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch and pass errors to next() for async errors', async () => {
        const error = new Error('Test error');
        const mockAsyncFunction = async () => {
            throw error;
        };

        const handler = asyncHandler(mockAsyncFunction);
        await handler(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous errors', () => {
        const error = new Error('Sync error');
        const mockSyncFunction = () => {
            throw error;
        };

        const handler = asyncHandler(mockSyncFunction);
        handler(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should work with middleware that uses next()', async () => {
        const mockMiddleware = (req: Request, res: Response, next: NextFunction) => {
            next();
        };

        const handler = asyncHandler(mockMiddleware);
        await handler(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});
