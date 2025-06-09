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
// import { Subscription } from "./Subscriptions";
import { LoginProvider } from "./enum/loginProvider";
import { Follower } from "./Follower";
import { Bookmark } from "./bookmark";
import { Rating } from "./Rating";

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

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ type: "enum", enum: LoginProvider, default: LoginProvider.LOCAL })
  provider!: LoginProvider;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  bookmarks!: Bookmark[];

  @OneToOne(() => Society, (society) => society.admin)
  society?: Society;

  @OneToMany(() => Follower, (follower) => follower.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  following!: Follower[];

  @OneToMany(() => EventEntity, (event) => event.createdBy, {
    cascade: true,
    onDelete: "CASCADE",
  })
  events!: EventEntity[];

  // @OneToMany(() => Subscription, (subscription) => subscription.user)
  // subscriptions!: Subscription[];

  @OneToMany(() => Rating, (rating) => rating.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  ratings!: Rating[];

  @OneToMany(() => Registration, (registration) => registration.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  registrations!: Registration[];

  @OneToMany(() => Announcement, (announcement) => announcement.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  announcements!: Announcement[];
}
