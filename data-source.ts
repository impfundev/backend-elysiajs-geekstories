import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Site } from "./entities/Site";
import { Post } from "./entities/Post";
import { Tag } from "./entities/Tag";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite3",
  synchronize: true, // auto create tables
  logging: false,
  entities: [User, Site, Post, Tag],
  migrations: [],
  subscribers: [],
});
