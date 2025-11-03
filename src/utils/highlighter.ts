// Impor inti hljs (sudah kamu miliki)
import hljs from "highlight.js/lib/core";

// Impor hanya bahasa yang kamu butuhkan
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // Untuk HTML, JSX
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";

// Daftarkan bahasa-bahasa tersebut
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);

export default hljs;
