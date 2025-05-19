import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from './Address';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    fname: string;

    @Column({ type: 'varchar' })
    lname: string;

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    addresses: Address[];
}