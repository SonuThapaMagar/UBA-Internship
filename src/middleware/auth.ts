import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole, AuthUser, AuthRequest } from '../types/auth.types';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token is required',
            statusCode: 401,
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
        (req as unknown as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token',
            statusCode: 403,
        });
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as unknown as AuthRequest;
        if (!authReq.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
                statusCode: 401,
            });
            return;
        }
        if (roles.includes(authReq.user.role)) {
            return next();
        }
        res.status(403).json({
            success: false,
            error: 'Insufficient permissions',
            statusCode: 403,
        });
    };
};

export const checkOwnership = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as unknown as AuthRequest;
    const { id } = req.params;
    if (authReq.user?.role === UserRole.ADMIN || authReq.user?.role === UserRole.MENTOR) {
        return next();
    }
    if (authReq.user?.id !== id) {
        res.status(403).json({
            success: false,
            error: 'You can only access your own data',
            statusCode: 403,
        });
        return;
    }
    next();
};