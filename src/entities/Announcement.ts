import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./User";
import { EventEntity } from "./EventEntity";
import { Society } from "./Society";

@Entity()
export class Announcement extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  title!: string;

  @Column("text")
  content!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.announcements)
  user!: User;

  @ManyToOne(() => EventEntity, (event) => event.announcements)
  event!: EventEntity;

  @ManyToOne(() => Society, (society) => society.announcements)
  society!: Society;
}
