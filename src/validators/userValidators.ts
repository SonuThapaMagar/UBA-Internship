import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../constants/errorMessages';

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        next(new Error(ERROR_MESSAGES.MISSING_REFRESH_TOKEN));
        return;
    }
    next();
};

export const validateAddressId = (req: Request, res: Response, next: NextFunction): void => {
    const { params } = req;
    const { id: addressId } = params;
    if (!addressId) {
        next(new Error(ERROR_MESSAGES.MISSING_ADDRESS_ID));
        return;
    }
    next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
    const { params } = req;
    const { id, userId } = params;
    const userIdToValidate = id || userId;
    
    if (!userIdToValidate) {
        next(new Error(ERROR_MESSAGES.MISSING_USER_ID));
        return;
    }
    next();
};

export const validateLoginCredentials = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(new Error(ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED));
        return;
    }
    next();
}; 