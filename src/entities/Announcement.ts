import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './User';
import { EventEntity } from './EventEntity';

@Entity()
export class Announcement extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string;

    @ManyToOne(() => User, user => user.announcements)
    user!: User;

    @ManyToOne(() => EventEntity, event => event.announcements)
    event!: EventEntity;
}
