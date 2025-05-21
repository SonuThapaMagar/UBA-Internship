import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', err);

    const status = (err && typeof err === 'object' && 'status' in err && err.status) || 500;
    const message = (err && typeof err === 'object' && 'message' in err && err.message) || 'Internal Server Error';

    res.status(status).json({
        success: false,
        error: message,
        statusCode: status,
    });
}