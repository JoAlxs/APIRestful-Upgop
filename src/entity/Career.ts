import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique, CreateDateColumn, UpdateDateColumn  } from 'typeorm'
import { IsNotEmpty } from 'class-validator';
import { Offer } from './Offer';

@Entity()
@Unique(["name"])
export class Career {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    acronym: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    @OneToMany(() => Offer, offer => offer.career)
    offer: Offer;
}