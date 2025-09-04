import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Society } from "./Society";

@Entity()
@Unique(["user", "society"])
export class Follower extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Society, (society) => society.followers, {
    onDelete: "CASCADE",
  })
  society!: Society;
}
