import { Request, Response, NextFunction } from "express";

export function userValidation(req: Request, res: Response, next: NextFunction) {

    if (!req.body.fname || !req.body.lname) {
        res.status(400).json({ error: "Firstname and lastname are required" });
        return;
    }
    next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    next();
}
