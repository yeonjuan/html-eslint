const { cwd } = process;
const { resolve, parse } = require("path");
const { readdirSync, statSync, existsSync, mkdirSync } = require("fs");
const createMarked = require("./marked");
const convertToHTML = require("./convert-to-html");

/**
 * @param {string} srcDir
 * @param {string} distDir
 * @param {string} outDir
 */
module.exports = function generateHTMLs(srcDir, distDir, outDir) {
  readdirSync(srcDir).forEach((filename) => {
    const filepath = resolve(srcDir, filename);
    const parsed = parse(filepath);
    if (statSync(filepath).isDirectory()) {
      const nextDistDir = resolve(distDir, filename);
      const nextOutDir = resolve(outDir, filename);
      if (!existsSync(nextDistDir)) mkdirSync(nextDistDir);
      if (!existsSync(nextOutDir)) mkdirSync(nextOutDir);

      generateHTMLs(filepath, nextDistDir, nextOutDir);
    } else if (parsed.ext === ".md") {
      convertToHTML(
        {
          markdownPath: filepath,
          templateHtmlPath: resolve(cwd(), "./src/components/template.html"),
        },
        {
          partialHtmlPath: resolve(outDir, parsed.name + ".html"),
          htmlPath: resolve(distDir, parsed.name + ".html"),
        },
        createMarked(),
        {
          includePath:
            outDir.slice(outDir.indexOf("/out") + 1) +
            "/" +
            parsed.name +
            ".html",
          wrapper: (html) => `<section class='md-wrapper'>${html}</section>`,
        }
      );
    }
  });
};
