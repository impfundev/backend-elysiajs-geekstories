import "prismjs/themes/prism-tomorrow.min.css";
import { highlightAll } from "prismjs";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/components/prism-css.min.js";
import "prismjs/components/prism-ruby.min.js";
import "prismjs/components/prism-python.min.js";
import "prismjs/components/prism-java.min.js";
import "prismjs/components/prism-c.min.js";
import "prismjs/components/prism-csharp.min.js";
import "prismjs/components/prism-cpp.min.js";

document.addEventListener("DOMContentLoaded", () => {
  let mounted = false;

  const options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    scrollMargin: "0px",
    threshold: 1.0,
  };

  const callback: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let elem = entry.target;

        if (entry.intersectionRatio >= 0.75 && !mounted) {
          try {
            highlightAll();
          } catch {
            // triggered
          }
          mounted = true;
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  const target = document.querySelector("pre");
  if (target) observer.observe(target);
});
