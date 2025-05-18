import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { EventEntity } from './EventEntity';
@Entity()
export class Society extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @OneToMany(() => EventEntity, event => event.society)
    events!: EventEntity[];
}
