import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    street: string;

    @Column({ type: 'varchar' })
    city: string;

    @Column({ type: 'varchar', nullable: false })
    country: string;

    @ManyToOne(() => User, (user) => user.addresses, { nullable: false })
    user: User;
}