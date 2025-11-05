import { Html } from "@elysiajs/html";

export const AdminPanel = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin</title>
        <meta name="description" content="Admin Panel" />
        <link
          rel="preload"
          href="/public/material-symbols-outlined-wsekpst3.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/public/main.css" />
      </head>
      <body class="light">
        <div id="root"></div>
        <script async src="/public/client/frontend.js" type="module"></script>
        <script defer src="/public/main.js"></script>
      </body>
    </html>
  );
};
