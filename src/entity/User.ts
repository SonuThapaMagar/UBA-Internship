import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Address } from "./Address";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];
}
