import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Site, Post, Tag } from "../entities";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "/app/data/database.sqlite3",
  synchronize: process.env.ENV == "development" || true,
  logging: false,
  entities: [User, Site, Post, Tag],
  migrations: [],
  subscribers: [],
});

export function initdatabase() {
  AppDataSource.initialize()
    .then(() => console.log("Database initialized!"))
    .catch((error) => console.error(`Database failed to initialized ${error}`));
}
