import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'internships' })
export class Internship {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    mentorName: string;

    @Column({ type: 'date' })
    joinedDate!: Date;

    @Column({ type: 'date', nullable: true })
    completionDate!: Date | null;

    @Column({ type: 'boolean', default: false })
    isCertified!: boolean;

    @ManyToOne(() => User, (user) => user.internships)
    @JoinColumn({ name: 'userId' })
    user: User;
}