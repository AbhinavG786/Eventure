import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Registration } from "./Registration";
import { Announcement } from "./Announcement";
import { EventEntity } from "./EventEntity";
import { UserRole } from "./enum/userRole";
import { Society } from "./Society";
import { LoginProvider } from "./enum/loginProvider";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  admissionNumber!: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  aboutMe?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ type: 'enum', enum: LoginProvider , default: LoginProvider.LOCAL}) 
  provider!: LoginProvider;

  @OneToOne(() => Society, (society) => society.admin)
  society?: Society;

  @OneToMany(() => EventEntity, (event) => event.createdBy)
  events!: EventEntity[];

  @OneToMany(() => Registration, (registration) => registration.user)
  registrations!: Registration[];

  @OneToMany(() => Announcement, (announcement) => announcement.user)
  announcements!: Announcement[];
}
