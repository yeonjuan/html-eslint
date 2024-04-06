import html from "@html-eslint/eslint-plugin";
import parser from "@html-eslint/parser";

export default [
  html.configs["flat/recommended"],
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser,
    },
  },
];
