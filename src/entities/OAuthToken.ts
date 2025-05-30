import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OAuthClient } from './OAuthClient';
import { User } from '../entity/User';

@Entity()
export class OAuthToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accessToken: string;

    @Column()
    refreshToken: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => OAuthClient)
    client: OAuthClient;

    @CreateDateColumn()
    createdAt: Date;
} 