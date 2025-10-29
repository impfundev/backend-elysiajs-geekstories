import { Elysia, status, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { Site } from "../../entities";
import { getList } from "../../utils/getList";
import { AppDataSource } from "../../config/database";

const repository = AppDataSource.getRepository(Site);

export const sites = new Elysia({ prefix: "site" })
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
      description: true,
      is_used: true,
      create_at: true,
      update_at: true,
    };
    const order = { update_at: "DESC" };
    return await getList({
      query,
      entity: Site,
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

      const site = await repository.findOneBy({ id });
      if (!site) throw status(400, "Site not found");

      return { message: "success", data: site };
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

      const is_used = body.is_used;
      if (is_used) {
        const usedSite = await repository.find({ where: { is_used: true } });
        usedSite.forEach((site) => {
          site.is_used = false;
          site.save();
        });
      }

      const site = repository.create(body);
      await repository.save(site);

      return { message: "created", data: site };
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        is_used: t.Boolean(),
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

      const is_used = body.is_used;
      if (is_used) {
        const usedSite = await repository.find({ where: { is_used: true } });
        usedSite.forEach((site) => {
          site.is_used = false;
          site.save();
        });
      }

      const site = await repository.findOneBy({ id });
      if (!site) throw status(400, "Site not found");

      Object.assign(site, body);
      await repository.save(site);

      return { message: "updated", data: site };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        is_used: t.Boolean(),
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

      const site = await repository.findOneBy({ id });
      if (!site) throw status(400, "Site not found");

      await repository.remove(site);

      return { message: "deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
