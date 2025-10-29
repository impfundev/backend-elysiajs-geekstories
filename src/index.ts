import { Elysia } from "elysia";
import { user } from "./controllers/user";
import { posts } from "./controllers/posts";
import { tags } from "./controllers/tags";
import { sites } from "./controllers/site";

import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import logixlysia from "logixlysia";

import { initdatabase } from "./config/database";
import { api } from "./controllers";
import { web } from "./views";
import { cloudinaryProxy } from "./controllers/proxy/cloudinary";

initdatabase();

Bun.build({
  entrypoints: ["./assets/main.ts"],
  outdir: "./public",
  minify: true,
})
  .then((res) => console.log("Asset Initialized"))
  .catch((error) => console.error(`Asset failed to initialized ${error}`));

const app = new Elysia()
  .use(openapi())
  .use(staticPlugin())
  .use(cors())
  .use(api)
  .use(web)
  .use(cloudinaryProxy)
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "simple",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss.SSS",
        },
        logFilePath: "./logs/example.log",
        ip: true,
        customLogFormat:
          "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
      },
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
