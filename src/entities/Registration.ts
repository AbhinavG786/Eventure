import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { User } from './User';
import { EventEntity } from './EventEntity';
@Entity()
export class Registration extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.registrations)
    user!: User;

    @ManyToOne(() => EventEntity, event => event.registrations)
    event!: Event;

    @Column()
    status!: string;
}