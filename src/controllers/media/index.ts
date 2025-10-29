import { Elysia, t } from "elysia";
import { v2 as cloudinary } from "cloudinary";
import jwt from "@elysiajs/jwt";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const media = new Elysia({ prefix: "/media" })
  // JWT
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "EfvVcs8ko+f8UvI6JekJFp4Hi8NnVTUhy9ZTmgViXSc=",
    })
  )

  // Endpoint [GET] /media
  .get("/", async ({ set }) => {
    try {
      const result = await cloudinary.search
        .expression("resource_type:image")
        .sort_by("uploaded_at", "desc")
        .max_results(50)
        .execute();

      return result.resources;
    } catch (error) {
      console.error("Error fetching Cloudinary resources:", error);
      set.status = 500;
      return { error: "Failed to fetch media" };
    }
  })

  // Endpoint [POST] /media/delete
  .post(
    "/delete",
    async ({ body, set }) => {
      try {
        const { public_id } = body;
        await cloudinary.uploader.destroy(public_id, {
          resource_type: "image",
        });

        return { success: true, public_id: public_id };
      } catch (error) {
        console.error("Error deleting Cloudinary resource:", error);
        set.status = 500;
        return { error: "Failed to delete media" };
      }
    },
    {
      body: t.Object({
        public_id: t.String(),
      }),
    }
  )

  // [POST] /media/upload
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
        const dataUri = `data:${file.type};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "app_uploads",
        });

        return result;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        set.status = 500;
        return { error: "Upload failed" };
      }
    },
    {
      body: t.Object({
        file: t.File({
          maxSize: "10m",
        }),
      }),
    }
  );
