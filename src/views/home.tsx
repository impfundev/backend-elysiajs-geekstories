import { Html } from "@elysiajs/html";
import { Post, Site } from "../entities";
import { WebLayout } from "./layout";
import { getImageData } from "../utils/cloudinary";
import { PostList } from "./posts/related";

interface HomePageProps {
  posts: Post[];
  site: Site;
}

export const HomePage = ({ posts, site }: HomePageProps) => {
  const firstPost = posts[0];
  const imageWidth = 768;
  const imageHeight = 360;
  const { imageUrl, imageSrcset } = getImageData(
    firstPost.image,
    imageWidth,
    imageHeight
  );

  return (
    <WebLayout title="Home" site={site}>
      <>
        <main class="responsive">
          <section class="grid">
            <div class="s12 m6 l6">
              <div class="page bottom active">
                <article class="no-elevate round large large-padding middle-align">
                  <div class="large-padding">
                    <h1 class="large">{firstPost.title}</h1>
                    <h6>{firstPost.description}</h6>
                    <nav>
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
          <section>
            <PostList title="Latest" posts={posts.slice(1)} />
          </section>
        </main>
      </>
    </WebLayout>
  );
};
