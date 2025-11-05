import { Post, Site } from "../../entities";
import { Html } from "@elysiajs/html";
import { WebLayout } from "../layout";
import { PostList } from "../posts/related";
import { Footer } from "./footer";
import { FeaturedPost } from "./featured";

interface HomePageProps {
  posts: Post[];
  site: Site;
}

export const HomePage = ({ posts, site }: HomePageProps) => {
  return (
    <WebLayout title="Home" description={site.description} site={site}>
      <main class="responsive">
        {posts[0] && <FeaturedPost post={posts[0]} />}
        <hr class="transparent medium-space" />
        <section>
          <PostList title="Latest" posts={posts.slice(1)} />
        </section>
        <hr class="transparent large-space" />
        <Footer site={site} />
      </main>
    </WebLayout>
  );
};
