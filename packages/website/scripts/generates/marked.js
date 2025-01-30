const renderer = require("./renderer");
const {
  markedHighlight
} = require("marked-highlight");
const {
  Marked
} = require("marked");
const hljs = require("highlight.js");
const xml = require("highlight.js/lib/languages/xml");

/**
 * @returns {Marked}
 */
function createMarked() {
  hljs.registerLanguage(
    "html",
    xml
  );
  const marked = new Marked(markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, info) {
      const [lang] = info.includes(",")
        ? info.split(",")
        : [info];
      const language = hljs.getLanguage(lang)
        ? lang
        : "plaintext";

      return hljs.highlight(
        code,
        {
          language
        }
      ).value;
    }
  }));
  marked.use({
    renderer
  });
  return marked;
}

module.exports = createMarked;
