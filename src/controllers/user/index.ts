import { Elysia, status, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { User } from "../../entities";
import { getList } from "../../utils/getList";
import { AppDataSource } from "../../config/database";

const repository = AppDataSource.getRepository(User);
export const user = new Elysia({ prefix: "user" })

  // Use JWT
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "EfvVcs8ko+f8UvI6JekJFp4Hi8NnVTUhy9ZTmgViXSc=",
    })
  )
  // List Paginate

  .get("/get_list", async ({ jwt, query, cookie: { session } }) => {
    const isAuthenticate = await jwt.verify(String(session.value));
    if (!isAuthenticate) return status(401, "Unauthorized");

    const select = {
      id: true,
      name: true,
      username: true,
      email: true,
      create_at: true,
      update_at: true,
    };
    const order = { update_at: "DESC" };
    return await getList({
      query,
      entity: User,
      select,
      order,
    });
  })

  // Get by id
  .get(
    "/:id",
    async ({ jwt, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const user = await repository.findOneBy({ id });
      if (!user) throw status(400, "User not found");

      return {
        message: "success",
        data: user,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Get Profile
  .get("/profile", async ({ jwt, cookie: { session } }) => {
    const payload = await jwt.verify(String(session.value));
    if (!payload) return status(401, "Unauthorized");

    return {
      message: "success",
      data: payload,
    };
  })

  // Register
  .post(
    "/register",
    async ({ body }) => {
      const user = new User();
      const newUser = Object.assign(user, body);
      repository.save(newUser);

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        username: t.String({ maxLength: 20 }),
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )

  // Login
  .post(
    "/login",
    async ({ jwt, body, cookie: { session } }) => {
      const { username, password } = body;
      if (!username) throw status(400, "Username is required.");

      const user = await repository.findOneBy({ username });
      if (!user) throw status(400, "Invalid Username or Email.");

      const isPasswordValid = await Bun.password.verify(
        password,
        user.password
      );
      if (!isPasswordValid) throw status(400, "Invalid Password.");

      const token = await jwt.sign({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      });

      session.set({
        value: token,
        httpOnly: true,
        maxAge: 7 * 86400,
      });

      return {
        message: "Login success",
        token,
      };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )

  // Logout
  .get("/logout", async ({ cookie: { session } }) => {
    session.set({
      value: "",
      httpOnly: true,
      maxAge: 0, // expired sekarang juga
      path: "/",
    });
    return { message: "logged out" };
  })

  // Update
  .put(
    "/:id",
    async ({ jwt, params: { id }, body, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const user = await repository.findOneBy({ id });
      if (!user) throw status(400, "User not found");

      try {
        const data = body as any;
        const isChangePassword = data.password;
        const validatedUser = Object.assign(user, body);
        if (isChangePassword) {
          validatedUser.password = await Bun.password.hash(
            validatedUser.password
          );
        }

        const updatedUser = await repository.save(validatedUser);

        const token = await jwt.sign({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        });

        session.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
        });

        return {
          message: `${
            updatedUser.name ? updatedUser.name : updatedUser.username
          } successfuly updated.`,
        };
      } catch (error) {
        if (error instanceof TypeError) throw status(400, "Invalid fields");
        throw status(500, "Internal Server Error");
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        username: t.String(),
        email: t.String(),
        password: t.Optional(t.String()),
      }),
    }
  )

  // Delete
  .delete(
    "/delete/:id",
    async ({ jwt, params: { id }, cookie: { session } }) => {
      const isAuthenticate = await jwt.verify(String(session.value));
      if (!isAuthenticate) return status(401, "Unauthorized");

      const { affected } = await repository.delete(id);
      if (!affected || affected == 0) status(400, "Data not found");

      return {
        message: "Delete success.",
        affected,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
