import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator';
import { Career } from './Career';

@Entity()
export class Offer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsNotEmpty()
    company: string;

    @Column()
    @IsNotEmpty()
    location: String;

    @Column()
    @IsNotEmpty()
    description: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    @IsNotEmpty()
    @ManyToOne(() => Career, career => career.offer, {
        nullable: true,
        onDelete: "SET NULL"
    })
    career: Career;
}