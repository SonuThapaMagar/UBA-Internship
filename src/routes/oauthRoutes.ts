import { Router, Request, Response } from 'express';
import { OAuthService } from '../config/oauth';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/asyncHandler';

export function createOAuthRouter(): Router {
    const router = Router();
    const userService = new UserService();
    const oauthService = new OAuthService(userService);

    // Authorization endpoint
    router.get('/authorize', asyncHandler(async (req: Request, res: Response) => {
        await oauthService.authorizeRequest(req, res);
    }));

    // Token endpoint
    router.post('/token', asyncHandler(async (req: Request, res: Response) => {
        await oauthService.tokenRequest(req, res);
    }));

    return router;
} 