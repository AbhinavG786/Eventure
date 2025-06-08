import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  Check,
} from "typeorm";
import { Society } from "./Society";
import { User } from "./User";
import { Registration } from "./Registration";
import { Announcement } from "./Announcement";
import { Bookmark } from "./bookmark";

@Entity()
@Check(`"rating" >= 1 AND "rating" <= 5`)
@Check(`"startTime" < "endTime"`)
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("text")
  description!: string;

  @Column("text")
  venue!: string;

  @Column("int", { default: 1 })
  rating!: number;

  @Column({ type: "timestamp" })
  startTime!: Date;

  @Column({ type: "timestamp" })
  endTime!: Date;

  @Column({ nullable: true })
  eventPic?: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  bookmarks!: Bookmark[];

  @ManyToOne(() => Society, (society) => society.events, {
    onDelete: "CASCADE",
  })
  society!: Society;

  @ManyToOne(() => User, (user) => user.events, {
    onDelete: "CASCADE",
  })
  createdBy!: User;

  @OneToMany(() => Registration, (registration) => registration.event,{
    cascade: true,
    onDelete: "CASCADE",
  })
  registrations!: Registration[];

  @OneToMany(() => Announcement, (announcement) => announcement.event,{
    cascade: true,
    onDelete: "CASCADE",
  })
  announcements!: Announcement[];
}
