import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  BaseEntity,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity()
export class Subscription extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique:true})
    endpoint!:string

    @Column()
    auth!:string

    @Column()
    p256dh!:string

    @ManyToOne(()=>User,(user)=>user.subscriptions)
    user!:User
}