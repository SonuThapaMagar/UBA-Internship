import { AppDataSource } from '../../data/mysql';
import { Internship } from '../../entity/Internship';
import { User } from '../../entity/User';
import { InternshipCreate } from '../../types/Internship';

export class InternshipService {
    private internshipRepo = AppDataSource.getRepository(Internship);
    private userRepo = AppDataSource.getRepository(User);

    async createInternship(data: InternshipCreate): Promise<Internship> {
        const user = await this.userRepo.findOne({ where: { id: data.userId } });
        if (!user) {
            throw new Error('Invalid user: User not found');
        }
        const newInternship = this.internshipRepo.create(data);
        return await this.internshipRepo.save(newInternship);
    }

    async getUserInternships(userId: string): Promise<Internship[]> {
        return await this.internshipRepo.find({ where: { userId } });
    }
}