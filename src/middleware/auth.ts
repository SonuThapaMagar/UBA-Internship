import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        fname: string;
        email: string;
        role: string;
    };
}

export const authenticateToken: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token is required',
            statusCode: 401
        });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables');
        res.status(500).json({
            success: false,
            error: 'Server configuration error: JWT_SECRET is missing',
            statusCode: 500
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: string; fname: string; email: string; role: string };
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: 'Token has expired',
                statusCode: 401
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({
                success: false,
                error: 'Invalid token',
                statusCode: 403,
                details: error.message
            });
        } else {
            res.status(403).json({
                success: false,
                error: 'Token verification failed',
                statusCode: 403,
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return;
    }
};

export const requireRole = (roles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
                statusCode: 401
            });
            return;
        }
        if (!roles.includes(authReq.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                statusCode: 403
            });
            return;
        }
        next();
    };
};