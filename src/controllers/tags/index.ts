import { Elysia, status, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { Tag } from "../../entities";
import { getList } from "../../utils/getList";
import { AppDataSource } from "../../config/database";

const repository = AppDataSource.getRepository(Tag);

export const tags = new Elysia({ prefix: "tag" })
  // JWT
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "EfvVcs8ko+f8UvI6JekJFp4Hi8NnVTUhy9ZTmgViXSc=",
    })
  )

  // List paginate
  .get("/get_list", async ({ jwt, query, cookie: { session } }) => {
    const isAuthenticate = await jwt.verify(String(session.value));
    if (!isAuthenticate) return status(401, "Unauthorized");

    const select = {
      id: true,
      name: true,
      slug: true,
      create_at: true,
      update_at: true,
    };
    const order = { update_at: "DESC" };
    return await getList({
      query,
      entity: Tag,
      select,
      order,
    });
  })

  // Get by ID
  .get(
    "/:id",
    async ({ jwt, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const tag = await repository.findOneBy({ id });
      if (!tag) throw status(400, "Tag not found");

      return { message: "success", data: tag };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create
  .post(
    "/",
    async ({ jwt, body, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const tag = repository.create(body);
      await repository.save(tag);

      return { message: "created", data: tag };
    },
    {
      body: t.Object({
        name: t.String(),
        slug: t.String(),
        image: t.Optional(t.String()),
        description: t.Optional(t.String()),
        metadata: t.Optional(t.Record(t.String(), t.Any())),
      }),
    }
  )

  // Update
  .put(
    "/:id",
    async ({ jwt, body, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const tag = await repository.findOneBy({ id });
      if (!tag) throw status(400, "Tag not found");

      Object.assign(tag, body);
      await repository.save(tag);

      return { message: "updated", data: tag };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        image: t.Optional(t.String()),
        description: t.Optional(t.String()),
        metadata: t.Optional(t.Record(t.String(), t.Any())),
      }),
    }
  )

  // Delete
  .delete(
    "/:id",
    async ({ jwt, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const tag = await repository.findOneBy({ id });
      if (!tag) throw status(400, "Tag not found");

      await repository.remove(tag);

      return { message: "deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
