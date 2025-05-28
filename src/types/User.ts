export interface Internship {
    id: number;
    userId: string;
    joinedDate: Date;
    completionDate?: Date | null;
    isCertified: boolean;
    mentorName: string;
    user?: User;
}

export interface User {
    id: string;
    fname: string;
    lname: string;
    email: string;
    password?: string;
    role: string;
    internships?: Internship[];
}

export interface UserCreate {
    fname: string;
    lname: string;
    email: string;
    password: string;
    role?: string;
}

export interface UserOptions {
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    role?: string;
}