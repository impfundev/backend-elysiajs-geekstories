import { Html } from "@elysiajs/html";
import { Post } from "../../entities";
import { getImageData } from "../../utils/cloudinary";

export const FeaturedPost = ({ post }: { post: Post }) => {
  const imageWidth = 768;
  const imageHeight = 360;
  const { imageUrl, imageSrcset } = getImageData(
    post.image,
    imageWidth,
    imageHeight
  );
  return (
    <section class="grid">
      <div class="s12 m6 l6">
        <div class="page bottom active">
          <article class="no-elevate round large large-padding middle-align">
            <div class="large-padding">
              <h1 class="large">{post.title}</h1>
              <p>{post.description}</p>
              <nav class="top-margin">
                <a href={`/post/${post.slug}`} class="chip extra">
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
                alt={post.title}
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
  );
};
