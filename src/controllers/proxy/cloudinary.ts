import { Elysia } from "elysia";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
if (!CLOUD_NAME)
  throw new Error("CLOUDINARY_CLOUD_NAME environment variable is not set.");

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;
export const cloudinaryProxy = new Elysia({ prefix: "/cld-proxy" }).get(
  "/*",
  async ({ params, set }) => {
    const imagePath = params["*"];
    const targetUrl = `${CLOUDINARY_BASE_URL}/${imagePath}`;

    try {
      const response = await fetch(targetUrl);

      if (!response.ok) {
        set.status = response.status;
        return await response.text();
      }

      const headers = new Headers();
      if (response.headers.has("Content-Type")) {
        headers.set("Content-Type", response.headers.get("Content-Type")!);
      }
      if (response.headers.has("Cache-Control")) {
        headers.set("Cache-Control", response.headers.get("Cache-Control")!);
      }
      if (response.headers.has("ETag")) {
        headers.set("ETag", response.headers.get("ETag")!);
      }
      if (response.headers.has("Content-Length")) {
        headers.set("Content-Length", response.headers.get("Content-Length")!);
      }

      return new Response(response.body, {
        status: 200,
        headers: headers,
      });
    } catch (error) {
      console.error("[Cloudinary Proxy Error]:", error);
      set.status = 500;
      return { error: "Failed to proxy Cloudinary image." };
    }
  }
);
