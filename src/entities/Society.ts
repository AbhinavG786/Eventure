import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  BaseEntity,
  JoinColumn,
} from "typeorm";
import { EventEntity } from "./EventEntity";
import { SocietyType } from "./enum/societyType";
import { User } from "./User";
import { Announcement } from "./Announcement";
import { Follower } from "./Follower";
@Entity()
export class Society extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ type: "enum", enum: SocietyType, default: SocietyType.OTHERS })
  type!: SocietyType;

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  admin!: User;

  @OneToMany(() => Follower, (follower) => follower.society,{
    cascade: true,
    onDelete: "CASCADE",
  })
  followers!: Follower[];

  @OneToMany(() => EventEntity, (event) => event.society,{
    cascade: true,
    onDelete: "CASCADE",
  })
  events!: EventEntity[];

  @OneToMany(() => Announcement, (announcement) => announcement.society,{
    cascade: true,
    onDelete: "CASCADE",
  })
  announcements!: Announcement[];
}
