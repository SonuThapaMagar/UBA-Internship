import { Request, Response, NextFunction } from "express";

export function userValidation(err:Error,req: Request, res: Response, next: NextFunction) {

    if (!req.body.fname || !req.body.lname) {
        res.status(400).json({ error: "Firstname and lastname are required" });
        return;
    }
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
    next();
};

export const validateUserId = (err:Error,req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    next();
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
}
