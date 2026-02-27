const html = require("@html-eslint/eslint-plugin");

module.exports = [
  {
    ...html.configs.all,
    files: ["**/*.html"],
  },
];
