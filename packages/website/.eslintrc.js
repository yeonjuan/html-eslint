module.exports = {
  root: true,
  overrides: [
    {
      files: ["**/*.js"],
      plugins: [
        "@html-eslint",
        "@stylistic"
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
      },
      rules: {
        "@html-eslint/indent": [
          "error",
          2
        ],
        "@html-eslint/element-newline": [
          "error",
          {
            skip: [
              "pre",
              "code"
            ]
          }
        ],
        "@html-eslint/lowercase": "error",
        "@html-eslint/no-extra-spacing-attrs": "error",
        "@html-eslint/no-multiple-empty-lines": "error",
        "@html-eslint/no-trailing-spaces": "error",
        "@html-eslint/quotes": "error",
        "@stylistic/indent": [
          "error",
          2
        ],
        "@stylistic/quote-props": [
          "error",
          "as-needed"
        ],
        "@stylistic/curly-newline": [
          "error",
          "always"
        ],
        "@stylistic/padded-blocks": [
          "error",
          "never"
        ],
        "@stylistic/lines-around-comment": "off",
        "@stylistic/space-before-function-paren": ["error", "never"],
        "@stylistic/function-call-argument-newline": ["error", "consistent"],
        "@stylistic/object-curly-newline": ["error",  {
          minProperties: 1
        }]
      }
    },
    {
      files: ["**/*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
      rules: {
        "@html-eslint/indent": [
          "error",
          2
        ],
        "@html-eslint/require-doctype": "off",
        "@html-eslint/no-target-blank": "error",
        "@html-eslint/require-button-type": "error",
        "@html-eslint/require-meta-charset": "error",
        "@html-eslint/require-meta-description": "error",
        "@html-eslint/no-abstract-roles": "error",
        "@html-eslint/no-aria-hidden-body": "error",
        "@html-eslint/no-positive-tabindex": "error",
        "@html-eslint/require-frame-title": "error",
        "@html-eslint/id-naming-convention": [
          "error",
          "kebab-case"
        ],
        "@html-eslint/no-multiple-empty-lines": "error",
        "@html-eslint/no-trailing-spaces": "error"
      }
    }
  ]
};
