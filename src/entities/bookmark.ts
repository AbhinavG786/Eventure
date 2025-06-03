// entities/Bookmark.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Unique,
} from "typeorm";
import { User } from "./User";
import { EventEntity } from "./EventEntity";

@Entity()
@Unique(["user", "event"])
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user!: User;

  @ManyToOne(() => EventEntity, (event) => event.bookmarks, {
    onDelete: "CASCADE",
  })
  event!: EventEntity;
}
