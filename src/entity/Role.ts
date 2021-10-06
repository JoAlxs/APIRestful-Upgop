import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    description: string;

    @Column()
    isActive: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    @OneToMany(() => User, user => user.rol)
    user: User;

    @ManyToMany(() => Permission, permission => permission.role, {
        nullable: true,
        cascade: false
    })
    @JoinTable()
    permissions: Permission[];
}