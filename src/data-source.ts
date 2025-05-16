import "reflect-metadata"
import { DataSource } from "typeorm"
// import { User,Event,Announcement,Society,Registration } from "./entities/Schema";
import {User} from "./entities/User"
import {EventEntity} from "./entities/EventEntity"
import {Registration} from "./entities/Registration"
import {Society} from "./entities/Society"
import {Announcement} from "./entities/Announcement"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "sunil786",
    database: "college_events",
    synchronize: true,
    logging: false,
    entities: [User, Society, EventEntity, Announcement, Registration],
  });
