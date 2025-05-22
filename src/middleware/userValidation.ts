import { Request, Response, NextFunction } from 'express';

export function userValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const { fname, lname, email, password, role } = req.body;
        
        if (!fname || !lname || !email || !password) {
            res.status(400).json({ 
                success: false,
                error: "Required fields are missing",
                fields: {
                    fname: !fname ? "First name is required" : null,
                    lname: !lname ? "Last name is required" : null,
                    email: !email ? "Email is required" : null,
                    password: !password ? "Password is required" : null
                }
            });
            return;
        }

        if (typeof fname !== 'string' || typeof lname !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({
                success: false,
                error: "Invalid input type",
                fields: {
                    fname: typeof fname !== 'string' ? "First name must be a string" : null,
                    lname: typeof lname !== 'string' ? "Last name must be a string" : null,
                    email: typeof email !== 'string' ? "Email must be a string" : null,
                    password: typeof password !== 'string' ? "Password must be a string" : null
                }
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                error: "Invalid email format",
                fields: {
                    email: "Please provide a valid email address"
                }
            });
            return;
        }

        // Validate admin email format
        if (role === 'admin' && !email.toLowerCase().includes('admin')) {
            res.status(400).json({
                success: false,
                error: "Invalid admin email",
                fields: {
                    email: "Admin email must contain 'admin' in the address"
                }
            });
            return;
        }

        // Validate role if provided
        if (role && !['admin', 'user'].includes(role)) {
            res.status(400).json({
                success: false,
                error: "Invalid role",
                fields: {
                    role: "Role must be either 'admin' or 'user'"
                }
            });
            return;
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                success: false,
                error: "Weak password",
                fields: {
                    password: "Password must be at least 8 characters long and contain letters, numbers, and special characters"
                }
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}

export function addressValidation(req: Request, res: Response, next: NextFunction): void {
    const { street, city, country } = req.body;
    if (!street || !city || !country) {
        res.status(400).json({ error: 'Street, city, and country are required' });
        return;
    }
    next();
}

export function validateUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId || req.params.id;
        
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}