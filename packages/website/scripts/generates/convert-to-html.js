/**
 * @typedef {import("marked").Marked} Marked
 */
const fs = require("fs");
const path = require("path");
const {
  html
} = require("@html-kit/html");

/**
 * @param {object} src
 * @param {string} src.markdownPath
 * @param {string} src.templateHtmlPath
 * @param {object} dist
 * @param {string} dist.partialHtmlPath
 * @param {string} dist.htmlPath
 * @param {Marked} marked
 * @param {object} options
 * @param {Function} options.wrapper
 * @param {string} options.includePath
 */
function convertToHTML(src, dist, marked, options) {
  const srcMarkdown = fs.readFileSync(
    src.markdownPath,
    "utf-8"
  );
  const partialHtml = options.wrapper(marked.parse(srcMarkdown));
  const dirname = path.dirname(dist.partialHtmlPath);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(
      dirname,
      {
        recursive: true
      }
    );
  }
  fs.writeFileSync(
    dist.partialHtmlPath,
    partialHtml
  );
  const templateHtml = fs.readFileSync(
    src.templateHtmlPath,
    "utf-8"
  );
  const meta = html`<title>${
    path.parse(src.markdownPath).name
  } - html-eslint</title>
    <link rel="canonical" href="${dist.htmlPath.
      replace(
        path.join(
          process.cwd(),
          "src"
        ),
        "https://html-eslint.org"
      ).
      replace(
        ".html",
        "/"
      )}">
   `;

  const content = templateHtml.
    replace(
      "{{path}}",
      options.includePath
    ).
    replace(
      "{{meta}}",
      meta
    );
  fs.writeFileSync(
    dist.htmlPath,
    content
  );
}

module.exports = convertToHTML;
