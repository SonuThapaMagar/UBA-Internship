import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// For user creation (all fields required)
export const userValidation: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
    body('fname').notEmpty().withMessage('First name is required'),
    body('lname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'user', 'mentor']).withMessage('Invalid role'),
    validationHandler,
];

// For user updates (all fields optional, validate only if provided)
export const updateUserValidation: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
    body('fname').if(body('fname').exists()).isString().withMessage('First name must be a string'),
    body('lname').if(body('lname').exists()).isString().withMessage('Last name must be a string'),
    body('email').if(body('email').exists()).isEmail().withMessage('Valid email is required'),
    body('password').if(body('password').exists()).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').if(body('role').exists()).isIn(['admin', 'user', 'mentor']).withMessage('Invalid role'),
    validationHandler,
];

export const validateUserId: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
    param('id').isUUID().withMessage('Valid UUID is required'),
    validationHandler,
];

export const loginValidation: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validationHandler,
];