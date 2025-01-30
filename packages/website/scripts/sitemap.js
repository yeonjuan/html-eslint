const path = require("path");
const generateSitemap = require("./generates/sitemap");

generateSitemap(
  path.join(
    __dirname,
    "../out"
  ),
  path.join(
    __dirname,
    "../out/sitemap.xml"
  ),
  "https://html-eslint.org"
);
