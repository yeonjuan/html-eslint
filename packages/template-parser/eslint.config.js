const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
