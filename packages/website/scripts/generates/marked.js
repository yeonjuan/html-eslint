const renderer = require("./renderer");
const { markedHighlight } = require("marked-highlight");
const { Marked } = require("marked");
const hljs = require("highlight.js");
const xml = require("highlight.js/lib/languages/xml");

/**
 * @param {string} classname
 * @returns {Marked}
 */
function createMarked(classname) {
  hljs.registerLanguage("html", xml);
  const marked = new Marked(
    markedHighlight({
      langPrefix: `hljs ${classname} language-`,
      highlight(code, info) {
        const [lang, file] = info.includes(",") ? info.split(",") : [info, ""];
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        let filecontent = file
          ? `<div class="w-full border-b mb-1">${file}</div>`
          : "";

        return filecontent + hljs.highlight(code, { language }).value;
      },
    })
  );
  marked.use({ renderer });
  return marked;
}

module.exports = createMarked;
