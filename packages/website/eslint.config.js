const html = require("@html-eslint/eslint-plugin");
const stylistic = require("@stylistic/eslint-plugin");
const parser = require("@html-eslint/parser");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    ignores: [
      "**/dist",
      "**/.turbo",
      "src/out",
      "**/node_modules",
      "src/docs",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/*.js"],
    plugins: {
      html,
      "@stylistic": stylistic,
    },
    extends: ["html/all"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "html/indent": ["error", 2],
      "@stylistic/indent": ["error", 2],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/curly-newline": ["error", "always"],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/lines-around-comment": "off",
      "@stylistic/space-before-function-paren": ["error", "never"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/object-curly-newline": [
        "error",
        {
          minProperties: 1,
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    extends: ["html/all"],
    language: "html/html",
    rules: {
      "html/indent": ["error", 2],
      "html/no-inline-styles": "off",
      "html/id-naming-convention": ["error", "kebab-case"]
    },
  },
]);
