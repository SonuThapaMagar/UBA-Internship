// src/types/auth.types.ts
import { Request } from 'express';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
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