import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        fname: string;
        email: string;
        role?: string;
    };
}

export const authenticateToken = (
    req: AuthRequest,
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
        res.status(500).json({
            success: false,
            error: 'JWT_SECRET is not defined',
            statusCode: 500
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: string; fname: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token',
            statusCode: 403
        });
        return;
    }
};

export const requireRole = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
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