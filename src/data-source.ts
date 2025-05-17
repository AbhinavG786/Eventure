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
    host: process.env.DB_HOST,  // will pick eventure-db in container
    port: 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "sunil786",
    database: process.env.DB_NAME || "college_events",
    synchronize: true,
    logging: false,
    entities: [User, Society, EventEntity, Announcement, Registration],
  });
