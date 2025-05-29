export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MENTOR = 'mentor',
}

export interface AuthUser {
    id: string;
    fname: string;
    email: string;
    role: UserRole;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}