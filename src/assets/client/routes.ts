import { DashboardPage } from "./pages/dashboard";
import { PostsPage } from "./pages/posts";
import { SitesPage } from "./pages/sites";
import { TagsPage } from "./pages/tags";

export const routes = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: "widgets",
    component: DashboardPage,
  },
  { name: "Posts", path: "posts", icon: "article", component: PostsPage },
  { name: "Tags", path: "tags", icon: "sell", component: TagsPage },
  { name: "Sites", path: "sites", icon: "globe", component: SitesPage },
];
