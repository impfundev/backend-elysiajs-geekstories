import { PurgeCSS } from "purgecss";

export async function render(pageComponent: JSX.Element) {
  const template = await pageComponent;
  const pageCss = await Bun.file("./public/css/page.css").text();
  const highlighterCss = await Bun.file("./public/highlighter.css").text();

  const themePurgecss = await new PurgeCSS().purge({
    content: [
      {
        raw: template,
        extension: "html",
      },
    ],
    css: ["./public/main.css"],
  });

  const styleTag = `<style>${themePurgecss[0].css}${pageCss}${highlighterCss}</style>`;
  const finalHtml = template
    .replace("</head>", `${styleTag}</head>`)
    .replace(
      "./material-symbols-outlined-wsekpst3.woff2",
      "/public/material-symbols-outlined-wsekpst3.woff2"
    );
  return finalHtml;
}
