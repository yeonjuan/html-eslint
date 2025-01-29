const path = require("path");
const fs = require("fs");

/**
 * @param {string} current
 * @param {(relativePath: string) => void} callback
 */
function traverseHTMLs(current, callback) {
  if (fs.lstatSync(current).isDirectory()) {
    fs.readdirSync(current).forEach((next) => {
      traverseHTMLs(
        path.join(
          current,
          next
        ),
        callback
      );
    });
    return;
  } else if (fs.lstatSync(current).isFile()) {
    const parsed = path.parse(current);
    if (parsed.ext === ".html") {
      callback(current);
    }
  }
}

/**
 * @param {string} relativePath
 * @param {string} baseUrl
 * @returns {[string, priority]}
 */
function toURL(relativePath, baseUrl) {
  const parsed = path.parse(relativePath);
  const name = parsed.name === "index"
    ? ""
    : parsed.name;
  const url = baseUrl + path.join(
    parsed.dir,
    name
  );
  return [
    url,
    name === ""
      ? 1
      : 0.7
  ];
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {string} baseUrl
 */
function generateSitemap(src, dest, baseUrl) {
  /**
   * @type {string[]}
   */
  const urls = [];

  traverseHTMLs(
    src,
    (path) => {
      urls.push(toURL(
        path.replace(
          src,
          ""
        ),
        baseUrl
      ));
    }
  );
  const date = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.
  map(([
    url,
    priority
  ]) => {
    return `<url>
  <loc>${url}</loc>
  <lastmod>${date}</lastmod>
  <priority>${priority}</priority>
</url>`;
  }).
  join("\n")}
</urlset>`;

  fs.writeFileSync(
    dest,
    sitemap,
    "utf-8"
  );
}

module.exports = generateSitemap;
