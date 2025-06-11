import "reflect-metadata";
import { DataSource } from "typeorm";
import "./config";
import path from "path";
// import { User,Event,Announcement,Society,Registration } from "./entities/Schema";
// import { User } from "./entities/User";
// import { EventEntity } from "./entities/EventEntity";
// import { Registration } from "./entities/Registration";
// import { Society } from "./entities/Society";
// import { Announcement } from "./entities/Announcement";
// // import { Subscription } from "./entities/Subscriptions";
// import { Follower } from "./entities/Follower";
// import { Bookmark } from "./entities/bookmark";
// import { Rating } from "./entities/Rating";

const isProd = process.env.NODE_ENV === "production";
const rootDir = isProd ? "dist" : "src";
const fileExt = isProd ? "js" : "ts";
// console.log("DATABASE_URL:", process.env.DATABASE_URL);
// try {
//   const dbUrl = process.env.DATABASE_URL;
//   console.log("Full URL:", dbUrl);
//   const parsed = new URL(dbUrl ?? "");
//   console.log("Username:", parsed.username);
//   console.log("Password:", parsed.password, " | typeof:", typeof parsed.password);
// } catch (err) {
//   console.error("Error parsing DATABASE_URL", err);
// }
export const AppDataSource = new DataSource({
  type: "postgres",
  // host: process.env.DB_HOST, // will pick eventure-db in container
  // port: 5432,
  // username: process.env.DB_USER || "postgres",
  // password: process.env.DB_PASSWORD || "sunil786",
  // database: process.env.DB_NAME || "college_events",
  url: process.env.DATABASE_URL,
  synchronize: false,
  migrationsRun: true,
  logging: true,
  // entities: [
  //   User,
  //   Society,
  //   EventEntity,
  //   Announcement,
  //   Registration,
  //   Follower,
  //   Bookmark,
  //   Rating
  // ],
  entities: [`${rootDir}/entities/**/*.${fileExt}`],
  migrations: [`${rootDir}/migrations/**/*.${fileExt}`],
  // entities: [path.join(__dirname, `./entity/**/*.${fileExt}`)],
  // migrations: [path.join(__dirname, `./migration/**/*.${fileExt}`)],
});
