import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Society } from "./Society";
import { User } from "./User";
import { Registration } from "./Registration";
import { Announcement } from "./Announcement";

@Entity()
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("text")
  description!: string;

  @Column({ type: "timestamp" })
  startTime!: Date;

  @Column({ type: "timestamp" })
  endTime!: Date;

  @ManyToOne(() => Society, (society) => society.events)
  society!: Society;

  @ManyToOne(() => User, (user) => user.events)
  createdBy!: User;

  @OneToMany(() => Registration, (registration) => registration.event)
  registrations!: Registration[];

  @OneToMany(() => Announcement, (announcement) => announcement.event)
  announcements!: Announcement[];
}
