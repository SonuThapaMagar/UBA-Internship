import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Internship } from './Internship';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    fname: string;

    @Column({ type: 'varchar', length: 255 })
    lname: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 50, default: 'user' })
    role: string;

    @OneToMany(() => Internship, (internship) => internship.user, { cascade: true })
    internships: Internship[];
}