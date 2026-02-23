/* eslint-disable @stylistic/indent */
/**
 * @import {Marked} from "marked";
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
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

  // Parse frontmatter from markdown
  const parsed = matter(srcMarkdown);
  const frontmatter = parsed.data;
  const markdownContent = parsed.content;

  const partialHtml = options.wrapper(marked.parse(markdownContent));
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

  // Extract title and description from frontmatter or use defaults
  const pageTitle = frontmatter.title || path.parse(src.markdownPath).name;
  const pageDescription = frontmatter.description || "";
  const fullTitle = `${pageTitle} - html-eslint`;

  // Generate canonical URL
  const canonicalUrl = dist.htmlPath.
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
    );

  // Build meta tags including SEO tags
  const metaTags = [
    `<title>${fullTitle}</title>`,
    `<link href="${canonicalUrl}" rel="canonical">`
  ];

  if (pageDescription) {
    metaTags.push(`<meta name="description" content="${pageDescription}">`);
    metaTags.push(`<meta property="og:title" content="${fullTitle}">`);
    metaTags.push(`<meta property="og:description" content="${pageDescription}">`);
    metaTags.push(`<meta name="twitter:title" content="${fullTitle}">`);
    metaTags.push(`<meta name="twitter:description" content="${pageDescription}">`);
  }

  const meta = html`${metaTags.join("\n    ")}`;

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
