import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from '../../app/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler middleware', () => {
    const req = {} as Request;
    const next = vi.fn();

    const createRes = () => {
        const res = {} as Partial<Response>;
        res.status = vi.fn().mockReturnThis();
        res.json = vi.fn();
        return res as Response;
    };

    it('should handle custom error with status and message', () => {
        const err = { status: 400, message: 'Bad Request' };
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Bad Request',
            statusCode: 400,
        });
    });

    it('should handle generic errors with default values', () => {
        const err = new Error('Something went wrong');
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Something went wrong',
            statusCode: 500,
        });
    });

    it('should handle error with no message', () => {
        const err = { status: 401 };
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Internal Server Error',
            statusCode: 401,
        });
    });

    it('should handle error with no status', () => {
        const err = { message: 'No status here' };
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'No status here',
            statusCode: 500,
        });
    });

    it('should handle string error', () => {
        const err = 'String error';
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Internal Server Error',
            statusCode: 500,
        });
    });

    it('should handle null error', () => {
        const err = null;
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Internal Server Error',
            statusCode: 500,
        });
    });

    it('should handle undefined error', () => {
        const err = undefined;
        const res = createRes();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Internal Server Error',
            statusCode: 500,
        });
    });
});