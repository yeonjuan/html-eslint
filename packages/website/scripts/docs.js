const { cwd } = process;
const { resolve } = require("path");
const generateHTMLs = require("./generates/htmls");
const generateMarkdowns = require("./generates/markdowns");

generateMarkdowns();

generateHTMLs(
  resolve(cwd(), "../../docs"),
  resolve(cwd(), "./src/docs"),
  resolve(cwd(), "./src/out")
);
