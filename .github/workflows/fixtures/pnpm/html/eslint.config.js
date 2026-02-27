const html = require("@html-eslint/eslint-plugin");

module.exports = [
  {
    plugins: {
        html,
    },
    language: "html/html",
    files: ["**/*.html"],
  },
  html.configs.all
];
