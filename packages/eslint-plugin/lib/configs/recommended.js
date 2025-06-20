/** @satisfies {import('eslint').Linter.FlatConfig} */
const recommended = {
  rules: {
    "@html-eslint/require-lang": "error",
    "@html-eslint/require-img-alt": "error",
    "@html-eslint/require-doctype": "error",
    "@html-eslint/require-title": "error",
    "@html-eslint/no-multiple-h1": "error",
    "@html-eslint/no-extra-spacing-attrs": "error",
    "@html-eslint/attrs-newline": "error",
    "@html-eslint/element-newline": [
      "error",
      {
        inline: [`$inline`],
      },
    ],
    "@html-eslint/no-duplicate-id": "error",
    "@html-eslint/indent": "error",
    "@html-eslint/require-li-container": "error",
    "@html-eslint/quotes": "error",
    "@html-eslint/no-obsolete-tags": "error",
    "@html-eslint/require-closing-tags": "error",
    "@html-eslint/no-duplicate-attrs": "error",
    "@html-eslint/use-baseline": "error",
    "@html-eslint/no-duplicate-in-head": "error",
  },
};

module.exports = recommended;
