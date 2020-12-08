module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
  },
};
