import moment from "moment";
import { Html } from "@elysiajs/html";
import { Post, Site } from "../../entities";
import { WebLayout } from "../layout";
import { PageToolbar } from "../ui/toolbar";
import { getImageData } from "../../utils/cloudinary";
import { PostList } from "./related";
import { Footer } from "../ui/footer";
import { createTocWithJSDOM } from "../../utils/toc";

interface PostPageProps {
  post: Post;
  site: Site;
  relatedPosts: Post[];
}

export const PostPage = ({ post, site, relatedPosts }: PostPageProps) => {
  const title = post.title + " | " + site.name;
  const date = new Date(post.update_at);
  const dateRelative = moment(post.update_at).calendar();

  const baseImageWidth = 768;
  const { imageUrl, imageSrcset } = getImageData(post.image, baseImageWidth);

  const author = post.author;
  const { tocHtml, modifiedContent } = createTocWithJSDOM(post.content);

  return (
    <WebLayout title={title} site={site} description={post.description || ""}>
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
                  <time datetime={date.toString()}>
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
            <div class="grid large-space">
              <div class="s12 m4">
                {tocHtml && (
                  <div class="surface-container padding">
                    <div class="chip">Table of Content</div>
                    {tocHtml}
                  </div>
                )}
              </div>

              <div class="s12 m8 first">
                {modifiedContent}
                <nav class="top-margin">
                  {post.tags.map((tag) => (
                    <a href={`/tag/${tag.slug}`} class="chip">
                      {tag.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </article>

          <div class="margin">
            <PostList title="Related Post" posts={relatedPosts} />
          </div>
          <hr class="transparent large-space" />
          <Footer site={site} />
        </main>
        <PageToolbar />
      </>
    </WebLayout>
  );
};
