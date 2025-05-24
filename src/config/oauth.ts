import { OAuth2Server } from 'oauth2-server';
import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export interface OAuthModel {
    getAccessToken: (token: string) => Promise<any>;
    getClient: (clientId: string, clientSecret: string) => Promise<any>;
    saveToken: (token: any, client: any, user: any) => Promise<any>;
    getUser: (username: string, password: string) => Promise<any>;
    validateScope: (user: any, client: any, scope: string) => Promise<string[]>;
}

export class OAuthService {
    private oauth: OAuth2Server;
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.oauth = new OAuth2Server({
            model: this.getOAuthModel(),
            accessTokenLifetime: 3600, // 1 hour
            refreshTokenLifetime: 1209600, // 14 days
            allowBearerTokensInQueryString: false
        });
    }

    private getOAuthModel(): OAuthModel {
        return {
            getAccessToken: async (token: string) => {
                // Implement token retrieval from database
                return this.userService.getAccessToken(token);
            },

            getClient: async (clientId: string, clientSecret: string) => {
                // Implement client validation
                return this.userService.getClient(clientId, clientSecret);
            },

            saveToken: async (token: any, client: any, user: any) => {
                // Implement token saving to database
                return this.userService.saveToken(token, client, user);
            },

            getUser: async (username: string, password: string) => {
                // Implement user authentication
                return this.userService.authenticateUser(username, password);
            },

            validateScope: async (user: any, client: any, scope: string) => {
                // Implement scope validation
                return this.userService.validateScope(user, client, scope);
            }
        };
    }

    async authenticateRequest(req: Request, res: Response): Promise<any> {
        return this.oauth.authenticate()(req, res);
    }

    async authorizeRequest(req: Request, res: Response): Promise<any> {
        return this.oauth.authorize()(req, res);
    }

    async tokenRequest(req: Request, res: Response): Promise<any> {
        return this.oauth.token()(req, res);
    }
} 