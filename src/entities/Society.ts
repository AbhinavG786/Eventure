import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  BaseEntity,
  JoinColumn
} from "typeorm";
import { EventEntity } from "./EventEntity";
import { SocietyType } from "./enum/societyType";
import { User } from "./User";
import { Announcement } from "./Announcement";
@Entity()
export class Society extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: "enum", enum: SocietyType, default: SocietyType.OTHERS })
  type!: SocietyType;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  admin!: User;

  @OneToMany(() => EventEntity, (event) => event.society)
  events!: EventEntity[];

  @OneToMany(()=>Announcement, (announcement) => announcement.society)
  announcements!: Announcement[];
}
