import { Request, Response, NextFunction } from 'express';
import { InternshipService } from '../services/internshipService';
import { InternshipCreate } from '../../types/Internship';

export class InternshipController {
    constructor(private readonly internshipService: InternshipService) {
        this.createInternship = this.createInternship.bind(this);
        this.getInternships = this.getInternships.bind(this);
    }

    async createInternship(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body.mentorName || !req.body.joinedDate) {
                next(new Error('Mentor name and joined date are required'));
                return;
            }

            const internshipData: InternshipCreate = {
                userId: req.params.id,
                mentorName: req.body.mentorName,
                joinedDate: req.body.joinedDate,
                completionDate: req.body.completionDate,
                isCertified: req.body.isCertified || false,
            };
            const newInternship = await this.internshipService.createInternship(internshipData);
            res.status(201).json(newInternship);
        } catch (error) {
            next(error);
        }
    }

    async getInternships(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const internships = await this.internshipService.getUserInternships(req.params.id);
            res.status(200).json(internships);
        } catch (error) {
            next(error);
        }
    }
}