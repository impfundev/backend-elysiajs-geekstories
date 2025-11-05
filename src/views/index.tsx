import Elysia, { status } from "elysia";
import { Post, Site, Tag, User } from "../entities";
import { html, Html } from "@elysiajs/html";
import { PostPage } from "./posts/page";
import { HomePage } from "./ui/home";
import { ListPage } from "./ui/list";
import { TagsList } from "./tags/list";
import { render } from "../utils/shortcuts";
import { In, Not } from "typeorm";
import { AdminPanel } from "./admin";
import { App } from "../assets/client/main";

export const web = new Elysia()
  .use(html())
  .get("/admin", async () => {
    if (process.env.ENV === "development") console.log(App);
    return <AdminPanel />;
  })
  .get("/", async () => {
    const posts = await Post.find({ take: 10, where: { published: true } });
    const site = await Site.findOneBy({ is_used: true });
    if (!site) throw status(400, "Post not found");
    return render(<HomePage posts={posts} site={site} />);
  })
  .get("/tag/:slug", async ({ params: { slug } }) => {
    const tag = await Tag.findOne({
      where: { slug },
      relations: ["posts"],
    });

    if (!tag) throw status(400, "Tag not found");

    const posts = tag.posts;
    const site = await Site.findOneBy({ is_used: true });
    if (!site) throw status(400, "Post not found");

    return render(
      <ListPage
        title={tag.name}
        description={tag.description}
        posts={posts.filter((post) => post.published == true)}
        site={site}
      />
    );
  })
  .get("/author/:username", async ({ params: { username } }) => {
    const author = await User.findOneBy({ username });
    if (!author) throw status(400, "Author not found");

    const posts = await Post.find({
      where: { author: { id: author.id }, published: true },
    });
    const site = await Site.findOneBy({ is_used: true });
    if (!site) throw status(400, "Page not found");

    return render(
      <ListPage
        title={author.name}
        description={`All from ${author.name}`}
        posts={posts}
        site={site}
      />
    );
  })
  .get("/post/:slug", async ({ params: { slug } }) => {
    const post = await Post.findOne({
      where: { slug },
      relations: ["author", "tags"],
    });
    if (!post) throw status(400, "Post not found");

    const site = await Site.findOne({ where: { is_used: true } });
    if (!site) throw status("Not Found", 400);

    const tags = post.tags.map((tag) => tag);
    const tagIds = tags.map((tag) => tag.id);
    const relatedPosts = await Post.find({
      where: {
        tags: {
          id: In(tagIds),
        },
        id: Not(post.id),
      },
      take: 5,
    });

    return render(
      <PostPage post={post} site={site} relatedPosts={relatedPosts} />
    );
  })
  .get("/topics/", async () => {
    const tags = await Tag.find({ take: 10 });
    const site = await Site.findOneBy({ is_used: true });
    if (!site) throw status(400, "Post not found");

    return render(<TagsList title="Topics" site={site} tags={tags} />);
  });
