import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { MinLength, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import bcryptjs from 'bcryptjs'
import { Role } from './Role';

@Entity()
@Unique(["username"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    lastname: string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    @IsEmail()
    username: string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ManyToOne(() => Role, role => role.user, {
        nullable: true,
        onDelete: "SET NULL"
    })
    rol: Role[];

    @Column()
    @IsOptional()
    @IsNotEmpty()
    resetToken: string;

    @Column()
    @IsOptional()
    @IsNotEmpty()
    refreshToken: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    hashPassword(): void {
        const salt = bcryptjs.genSaltSync(10)
        this.password = bcryptjs.hashSync(this.password, salt)
    }

    checkPassword(password: string): boolean {
        return bcryptjs.compareSync(password, this.password)
    }
}