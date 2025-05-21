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

    @Column({type:'varchar'})
    email:string;
    
    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    addresses: Address[];
}