const path = require("path");
const generateRobots = require("./generates/robots");

generateRobots(
  path.join(
    __dirname,
    "../out/robots.txt"
  ),
  "https://html-eslint.org/sitemap.xml"
);
