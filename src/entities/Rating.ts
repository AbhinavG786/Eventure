import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Unique,
  Column,
  Check
} from "typeorm";
import { User } from "./User";
import { EventEntity } from "./EventEntity";

@Entity()
@Check(`"rating" >= 1 AND "rating" <= 5`)
@Unique(["user", "event"])
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int", { default: 1 })
  rating!: number;

  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => EventEntity, (event) => event.ratings, {
    onDelete: "CASCADE",
  })
  event!: EventEntity;
}
