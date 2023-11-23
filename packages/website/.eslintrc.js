module.exports = {
  root: true,
  plugins: ["@html-eslint"],
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
  overrides: [
    {
      files: ["**/*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
      rules: {
        "@html-eslint/require-doctype": "off",
        "@html-eslint/no-target-blank": "error",
        "@html-eslint/require-button-type": "error",
        "@html-eslint/require-meta-charset": "error",
        "@html-eslint/require-meta-description": "error",
        "@html-eslint/no-abstract-roles": "error",
        "@html-eslint/no-aria-hidden-body": "error",
        "@html-eslint/no-positive-tabindex": "error",
        "@html-eslint/require-frame-title": "error",
        "@html-eslint/id-naming-convention": ["error", "kebab-case"],
        "@html-eslint/no-multiple-empty-lines": "error",
        "@html-eslint/no-trailing-spaces": "error",
      },
    },
  ],
};
