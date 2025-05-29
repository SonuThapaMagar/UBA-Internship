import { User } from "../entity/User";

export interface Internship {
    id: number;
    userId: string;
    mentorName: string;
    joinedDate: Date;
    completionDate?: Date | null;
    isCertified: boolean;
    user?: User;
}

export interface InternshipCreate {
    userId: string;
    mentorName: string;
    joinedDate: Date;
    completionDate?: Date | null;
    isCertified?: boolean;
}