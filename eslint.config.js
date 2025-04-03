const jest = require("eslint-plugin-jest");
const node = require("eslint-plugin-n");
const globals = require("globals");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      "**/node_modules",
      "**/.vscode",
      "**/.parcel-cache",
      "**/out",
      "**/integration-test-projects",
      "**/coverage",
    ],
  },
  ...compat.extends("eslint:recommended"),
  {
    plugins: {
      jest,
      node,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 9,
      sourceType: "commonjs",
    },

    rules: {
      "node/no-unsupported-features/es-builtins": "error",
      "node/no-unsupported-features/es-syntax": "error",
      "node/no-unsupported-features/node-builtins": "error",
    },
  },
  {
    files: ["**/*.test.js"],

    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
  },
  {
    files: ["tools/**/*.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  },
];
