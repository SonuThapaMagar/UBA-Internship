import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class OAuthClient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    clientId: string;

    @Column()
    clientSecret: string;

    @Column('simple-array')
    redirectUris: string[];

    @Column('simple-array')
    grants: string[];

    @Column('simple-array')
    scopes: string[];

    @CreateDateColumn()
    createdAt: Date;
} 