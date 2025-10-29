import { Html } from "@elysiajs/html";
import { Post } from "../../entities";
import moment from "moment";

export const PostList = ({
  title,
  posts,
}: {
  title: string;
  posts: Post[];
}) => {
  return (
    <article class="round large-padding">
      <h5>{title}</h5>
      <hr class="transparent space" />
      <div class="grid">
        {posts.map((post) => {
          const date = new Date(post.update_at);
          const dateRelative = moment(post.update_at).calendar();

          return (
            <div class="s12">
              <div>
                <a class="link" href={`/post/${post.slug}`}>
                  {post.title}
                </a>
              </div>
              <small class="secondary-text">
                <time datetime={date}>
                  Posted on {date.toLocaleDateString()} {dateRelative}
                </time>
              </small>
              <div>{post.description}</div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
