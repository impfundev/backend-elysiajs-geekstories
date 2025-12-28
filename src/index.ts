import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import logixlysia from "logixlysia";

import { initdatabase } from "./config/database";
import { api } from "./controllers";
import { web } from "./web";
import { cloudinaryProxy } from "./controllers/proxy/cloudinary";
import { buildAsset } from "./utils/buildAsset";

initdatabase();
buildAsset();

const app = new Elysia()
  .use(openapi())
  .use(
    staticPlugin({
      headers: {
        "Cache-Control": "max-age=31536000",
      },
    }),
  )
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
    }),
  )
  .listen({
    hostname: "0.0.0.0",
    port: 3000,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
