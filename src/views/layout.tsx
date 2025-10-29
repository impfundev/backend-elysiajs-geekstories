import { Html } from "@elysiajs/html";
import { Site } from "../entities";

interface WebLayoutProps {
  title: string;
  site: Site;
  children: JSX.Element;
}

export const WebLayout = ({ title, site, children }: WebLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>

        <link rel="stylesheet" href="/public/main.css" />
      </head>
      <body>
        <header class="fixed top">
          <nav>
            <div class="max">
              <a href="/" class="chip transparent no-border">
                <strong>{site.name}</strong>
              </a>
            </div>
            <button class="chip" data-ui="#dialog-right">
              <i>menu_open</i>
            </button>
          </nav>
        </header>

        {children}

        <dialog class="right" id="dialog-right">
          <div class="right-align">
            <button class="chip" data-ui="#dialog-right">
              <i>close</i>
            </button>
          </div>
          <ul class="list">
            <li class="middle-align">
              <a href="/">
                <i>home</i>
                <span>Home</span>
              </a>
            </li>
            <li class="middle-align">
              <a href="/topics/">
                <i>sell</i>
                <span>Topics</span>
              </a>
            </li>
            <li class="middle-align">
              <a href="#">
                <i>search</i>
                <span>Search</span>
              </a>
            </li>
          </ul>
        </dialog>
        <script src="/public/main.js"></script>
      </body>
    </html>
  );
};
