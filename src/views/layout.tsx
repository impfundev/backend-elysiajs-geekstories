import { Html } from "@elysiajs/html";
import { Site } from "../entities";
import { Sidebar } from "./ui/sidebar";

interface WebLayoutProps {
  title: string;
  description: string;
  site: Site;
  children: JSX.Element;
}

export const WebLayout = ({
  title,
  site,
  children,
  description,
}: WebLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="preload"
          href="/public/material-symbols-outlined-wsekpst3.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
      </head>
      <body>
        <header class="fixed top responsive backdrop-blur">
          <nav>
            <div class="max">
              <a href="/" class="chip transparent">
                <strong>{site.name}</strong>
              </a>
            </div>
            <button class="chip" data-ui="#dialog-right">
              <i>menu_open</i>
            </button>
          </nav>
          <Sidebar />
        </header>

        {children}
        <div class="overlay"></div>
        <script defer src="/public/highlighter.js"></script>
        <script defer src="/public/main.js"></script>
      </body>
    </html>
  );
};
