declare module 'oauth2-server' {
    import { Request, Response } from 'express';

    export class OAuth2Server {
        constructor(options: any);
        authenticate(): (req: Request, res: Response) => Promise<any>;
        authorize(): (req: Request, res: Response) => Promise<any>;
        token(): (req: Request, res: Response) => Promise<any>;
    }
} 