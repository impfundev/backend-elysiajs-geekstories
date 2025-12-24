import { Elysia, t } from "elysia";
import { v2 as cloudinary } from "cloudinary";
import jwt from "@elysiajs/jwt";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  JWT_SECRET,
} = process.env;

const isCloudinaryConfigured = !!(
  CLOUDINARY_CLOUD_NAME &&
  CLOUDINARY_API_KEY &&
  CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const media = new Elysia({ prefix: "/media" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET || "EfvVcs8ko+f8UvI6JekJFp4Hi8NnVTUhy9ZTmgViXSc=",
    })
  )

  .get("/status", () => {
    return {
      active: isCloudinaryConfigured,
      message: isCloudinaryConfigured
        ? "Cloudinary is ready."
        : "Cloudinary is not configured.",
    };
  })

  // Global Guard: Cegah akses ke fungsi upload/delete jika config mati
  .onBeforeHandle(({ set }) => {
    if (!isCloudinaryConfigured) {
      set.status = 404;
      return {
        error: "Media service is not available (Cloudinary config missing).",
      };
    }
  })

  .get("/", async ({ set }) => {
    try {
      const result = await cloudinary.search
        .expression("resource_type:image")
        .sort_by("uploaded_at", "desc")
        .max_results(50)
        .execute();
      return result.resources;
    } catch (err) {
      console.error("Cloudinary Fetch Error:", err);
      set.status = 500;
      return { error: "Failed to fetch media" };
    }
  })

  .post(
    "/delete",
    async ({ body, set }) => {
      try {
        const { public_id } = body;
        await cloudinary.uploader.destroy(public_id, {
          resource_type: "image",
        });
        return { success: true, public_id };
      } catch (err) {
        console.error("Cloudinary Delete Error:", err);
        set.status = 500;
        return { error: "Failed to delete media" };
      }
    },
    {
      body: t.Object({ public_id: t.String() }),
    }
  )

  .post(
    "/upload",
    async ({ body, set }) => {
      const { file } = body;
      if (!file.type.startsWith("image/")) {
        set.status = 400;
        return { error: "File must be an image." };
      }

      try {
        const fileBuffer = await file.arrayBuffer();
        const b64 = Buffer.from(fileBuffer).toString("base64");

        const result = await cloudinary.uploader.upload(
          `data:${file.type};base64,${b64}`,
          { folder: "app_uploads" }
        );
        return result;
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        set.status = 500;
        return { error: "Upload failed" };
      }
    },
    {
      body: t.Object({
        file: t.File({ maxSize: "10m" }),
      }),
    }
  );
