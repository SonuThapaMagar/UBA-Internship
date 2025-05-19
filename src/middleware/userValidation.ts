import { Request, Response, NextFunction } from 'express';

export function userValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const { fname, lname } = req.body;
        
        if (!fname || !lname) {
            res.status(400).json({ 
                success: false,
                error: "Both firstname and lastname are required",
                fields: {
                    fname: !fname ? "First name is required" : null,
                    lname: !lname ? "Last name is required" : null
                }
            });
            return;
        }

        if (typeof fname !== 'string' || typeof lname !== 'string') {
            res.status(400).json({
                success: false,
                error: "Invalid input type",
                fields: {
                    fname: typeof fname !== 'string' ? "First name must be a string" : null,
                    lname: typeof lname !== 'string' ? "Last name must be a string" : null
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
        const { id } = req.params;
        
        if (!id) {
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid User ID format"
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}