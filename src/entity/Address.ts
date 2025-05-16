import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE'
    })
    user: User;
}