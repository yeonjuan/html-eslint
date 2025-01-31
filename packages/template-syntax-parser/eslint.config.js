const js = require("@eslint/js");
const globals = require("globals");
module.exports = [
  js.configs.recommended,

  {
    ignores: ["eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
