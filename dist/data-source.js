"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
// import { User,Event,Announcement,Society,Registration } from "./entities/Schema";
const User_1 = require("./entities/User");
const EventEntity_1 = require("./entities/EventEntity");
const Registration_1 = require("./entities/Registration");
const Society_1 = require("./entities/Society");
const Announcement_1 = require("./entities/Announcement");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST, // will pick eventure-db in container
    port: 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "sunil786",
    database: process.env.DB_NAME || "college_events",
    synchronize: true,
    logging: false,
    entities: [User_1.User, Society_1.Society, EventEntity_1.EventEntity, Announcement_1.Announcement, Registration_1.Registration],
});
