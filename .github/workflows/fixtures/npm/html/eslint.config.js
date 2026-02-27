const html = require("@html-eslint/eslint-plugin");

module.exports = [
  {
    plugins: {
            html,
    },
    language: "html/html",
    extends: ["html/all"],
    files: ["**/*.html"],
  },
];
