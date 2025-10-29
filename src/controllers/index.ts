import Elysia from "elysia";
import { user } from "./user";
import { posts } from "./posts";
import { tags } from "./tags";
import { sites } from "./site";
import { media } from "./media";

export const api = new Elysia({ prefix: "/api" })
  .use(user)
  .use(posts)
  .use(tags)
  .use(sites)
  .use(media);
