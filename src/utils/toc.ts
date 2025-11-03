import { JSDOM } from "jsdom";

export function createTocWithJSDOM(postContentString: string) {
  const dom = new JSDOM(postContentString);
  const document = dom.window.document;
  const headings = document.querySelectorAll("h2, h3");

  if (headings.length === 0) {
    return { tocHtml: "", modifiedContent: postContentString };
  }
  const tocItems = [];
  let currentH2List: any;

  headings.forEach((heading, index) => {
    const tagName = heading.tagName.toLowerCase();
    const text = heading.textContent;
    let id = heading.getAttribute("id");
    if (!id) {
      id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      id = `${id}-${index}`;
      heading.setAttribute("id", id);
    }

    const listItemHtml = `<li><a href="#${id}">${text}</a></li>`;
    if (tagName === "h2") {
      if (currentH2List) {
        tocItems.push(currentH2List + "</ul></li>");
      }

      tocItems.push(`<li><a href="#${id}">${text}</a>`);
      currentH2List = "<ul>";
    } else if (tagName === "h3" && currentH2List) {
      currentH2List += `<li><a href="#${id}">${text}</a></li>`;
    } else if (tagName === "h3") {
      tocItems.push(listItemHtml);
    }
  });

  if (currentH2List) {
    tocItems.push(currentH2List + "</ul></li>");
  }

  const tocHtml = `<ul>\n${tocItems.join("\n")}\n</ul>`;
  const modifiedContent = dom.window.document.body.innerHTML;

  return { tocHtml, modifiedContent };
}
