import { Html } from "@elysiajs/html";
import { WebLayout } from "../layout";
import { Site, Tag } from "../../entities";
import { getImageData } from "../../utils/cloudinary";

interface TagsListProps {
  title: string;
  site: Site;
  tags: Tag[];
}

export const TagsList = ({ title, site, tags }: TagsListProps) => {
  return (
    <WebLayout title={title} site={site}>
      <main class="responsive">
        {tags.map((tag) => {
          const imageWidth = 768;
          const imageHeight = 360;
          const { imageUrl, imageSrcset } = getImageData(
            tag.image,
            imageWidth,
            imageHeight
          );

          return (
            <div class="grid">
              <div class="s12 m6 l6">
                <div class="page bottom active">
                  <article class="no-elevate round large large-padding middle-align">
                    <div class="large-padding">
                      <h1 class="large">{tag.name}</h1>
                      <h6>{tag.description}</h6>
                      <nav>
                        <a href={`/tag/${tag.slug}`} class="chip extra">
                          See Posts
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
                        alt={tag.name}
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
            </div>
          );
        })}
      </main>
    </WebLayout>
  );
};
