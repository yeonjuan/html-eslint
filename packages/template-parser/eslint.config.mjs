import js from "@eslint/js";
import globals from "globals";
export default [
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
