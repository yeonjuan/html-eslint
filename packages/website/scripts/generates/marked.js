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
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );
  marked.use({ renderer });
  return marked;
}

module.exports = createMarked;
