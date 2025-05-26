import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole, AuthUser, AuthRequest } from '../types/auth.types';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token is required',
            statusCode: 401
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token',
            statusCode: 403
        });
    }
};

export const requireRole = (roles: UserRole[]) => {
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

        if (authReq.user.role === UserRole.ADMIN || roles.includes(authReq.user.role)) {
            return next();
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

export const checkOwnership = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    
    if (authReq.user?.role === UserRole.ADMIN) {
        next();
        return;
    }

    if (authReq.user?.id !== id) {
        res.status(403).json({
            success: false,
            error: 'You can only access your own data',
            statusCode: 403
        });
        return;
    }

    next();
};