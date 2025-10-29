import moment from "moment";

import { Html } from "@elysiajs/html";
import { Post, Site } from "../../entities";
import { WebLayout } from "../layout";
import { PageToolbar } from "./toolbar";
import { getImageData } from "../../utils/cloudinary";
import { In, Not } from "typeorm";
import { PostList } from "./related";

interface PostPageProps {
  post: Post;
  site: Site;
}

export const PostPage = async ({ post, site }: PostPageProps) => {
  const title = post.title + " | " + site.name;
  const date = new Date(post.update_at);
  const dateRelative = moment(post.update_at).calendar();

  const baseImageWidth = 768;
  const { imageUrl, imageSrcset } = getImageData(post.image, baseImageWidth);

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

  const author = post.author;

  return (
    <WebLayout title={title} site={site}>
      <>
        <main class="responsive">
          <article class="transparent top-margin">
            <header>
              <h1>{post.title}</h1>
              <p>{post.description}</p>
              <hr class="transparent large-space" />
              <nav>
                <a
                  href={`/author/${author.username}`}
                  class="chip circle large"
                >
                  <i>person</i>
                </a>
                <div>
                  <div>
                    <a href={`/author/${author.username}`}>{author.name}</a>
                  </div>
                  <time datetime={date}>
                    Posted on {date.toLocaleDateString()} {dateRelative}
                  </time>
                </div>
              </nav>
              <hr class="transparent large-space" />
            </header>

            {imageUrl && (
              <img
                src={imageUrl}
                alt={post.title}
                width={baseImageWidth}
                class="responsive"
                fetchpriority="high"
                srcset={imageSrcset}
                loading="eager"
              />
            )}

            <hr class="transparent large-space" />
            <div>{post.content}</div>
            <nav>
              {tags.map((tag) => (
                <a href={`/tag/${tag.slug}`} class="chip">
                  {tag.name}
                </a>
              ))}
            </nav>
          </article>
          <div class="margin">
            <PostList title="Related Post" posts={relatedPosts} />
          </div>
          <hr class="transparent large-space" />
        </main>
        <PageToolbar />
      </>
    </WebLayout>
  );
};
