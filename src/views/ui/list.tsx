import { Post, Site } from "../../entities";
import { Html } from "@elysiajs/html";
import { WebLayout } from "../layout";
import { getImageData } from "../../utils/cloudinary";
import { PostList } from "../posts/related";
import { Footer } from "./footer";

interface ListPageProps {
  title: string;
  description?: string;
  posts: Post[];
  site: Site;
}

export const ListPage = ({
  title,
  description,
  posts,
  site,
}: ListPageProps) => {
  const firstPost = posts[0];
  const imageWidth = 768;
  const imageHeight = 360;
  const { imageUrl, imageSrcset } = getImageData(
    firstPost && firstPost.image,
    imageWidth,
    imageHeight
  );

  return (
    <WebLayout
      title={title}
      site={site}
      description={description || site.description}
    >
      <>
        <main class="responsive">
          <h1>{title}</h1>
          <p>{description}</p>
          <hr class="transparent medium-space" />
          {firstPost && (
            <section class="grid">
              <div class="s12 m6 l6">
                <div class="page bottom active">
                  <article class="no-elevate round large large-padding middle-align">
                    <div class="large-padding">
                      <h1 class="large">{firstPost.title}</h1>
                      <p>{firstPost.description}</p>
                      <nav class="top-margin">
                        <a href={`/post/${firstPost.slug}`} class="chip extra">
                          Read more
                        </a>
                      </nav>
                    </div>
                  </article>
                </div>
              </div>
              <div class="s12 m6 l6">
                <div class="page top active">
                  <article class="no-elevate round large no-padding">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={firstPost.title}
                        width={imageWidth}
                        height={imageHeight}
                        class="responsive"
                        fetchpriority="high"
                        srcset={imageSrcset}
                        loading="eager"
                      />
                    )}
                  </article>
                </div>
              </div>
            </section>
          )}
          <hr class="transparent medium-space" />
          <section>
            <PostList title="Latest" posts={posts.slice(1)} />
          </section>
          <hr class="transparent large-space" />
          <Footer site={site} />
        </main>
      </>
    </WebLayout>
  );
};
