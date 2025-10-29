import { Elysia, status, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { Post, User, Tag } from "../../entities";
import { getList } from "../../utils/getList";
import { AppDataSource } from "../../config/database";
import { In } from "typeorm";

const repository = AppDataSource.getRepository(Post);
const userRepo = AppDataSource.getRepository(User);
const tagRepo = AppDataSource.getRepository(Tag);

export const posts = new Elysia({ prefix: "post" })
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

    const relations = { author: true, tags: true };
    const select = {
      id: true,
      title: true,
      slug: true,
      published: true,
      author: {
        name: true,
      },
      tags: {
        name: true,
      },
      description: true,
      create_at: true,
      update_at: true,
    };

    const order = { update_at: "DESC" };
    return await getList({
      query,
      entity: Post,
      relations,
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

      const post = await repository.findOne({
        where: { id },
        relations: ["author", "tags"],
      });
      if (!post) throw status(400, "Post not found");

      return { message: "success", data: post };
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

      // find author
      const author = await userRepo.findOneBy({
        id: String(isAuthenticate.id),
      });
      if (!author) throw status(400, "Author not found");

      const post = repository.create({
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        published: body.published,
        image: body.image,
        author,
      });

      if (body.tags) {
        const tags = await tagRepo.find({
          where: {
            id: In(body.tags.map((t) => t.id)),
          },
        });
        post.tags = tags;
      }

      await repository.save(post);

      return { message: "created", data: post };
    },
    {
      body: t.Object({
        title: t.String(),
        slug: t.String(),
        description: t.Optional(t.String()),
        content: t.String(),
        published: t.Boolean(),
        image: t.String(),
        tags: t.Optional(
          t.Array(
            t.Object({
              id: t.String(),
              name: t.String(),
            })
          )
        ),
      }),
    }
  )

  // Update
  .put(
    "/:id",
    async ({ jwt, body, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const post = await repository.findOne({
        where: { id },
        relations: ["author", "tags"],
      });
      if (!post) throw status(400, "Post not found");
      if (body.tags) {
        const tags = await tagRepo.find({
          where: {
            id: In(body.tags.map((t) => t.id)),
          },
        });
        post.tags = tags;
      }

      if (!post.author) {
        const user = await User.findOneBy({ id: isAuthenticate.id as string });
        if (user) post.author = user;
      }

      Object.assign(post, {
        title: body.title ?? post.title,
        slug: body.slug ?? post.slug,
        description: body.description ?? post.description,
        content: body.content ?? post.content,
        published: body.published ?? post.published,
        image: body.image ?? post.image,
      });

      await repository.save(post);

      return { message: "updated", data: post };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        content: t.Optional(t.String()),
        published: t.Boolean(),
        authorId: t.Optional(t.String()),
        image: t.String(),
        tags: t.Optional(
          t.Array(
            t.Object({
              id: t.String(),
              name: t.String(),
            })
          )
        ),
      }),
    }
  )

  // Delete
  .delete(
    "/:id",
    async ({ jwt, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const post = await repository.findOneBy({ id });
      if (!post) throw status(400, "Post not found");

      await repository.remove(post);

      return { message: "deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
