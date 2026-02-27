const htmlReact = require("@html-eslint/eslint-plugin-react");

module.exports = [
  {
    files: ["**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ...htmlReact.configs.all,
  },
];
