import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User";
import { EventEntity } from "./EventEntity";
import { RegistrationStatus } from "./enum/registrationStatus";
@Entity()
export class Registration extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.registrations, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => EventEntity, (event) => event.registrations, {
    onDelete: "CASCADE",
  })
  event!: EventEntity;

  @Column({
    type: "enum",
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  status!: RegistrationStatus;
}
