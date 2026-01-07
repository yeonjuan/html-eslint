const  htmlEslint = require("@html-eslint/eslint-plugin");
const  stylistic = require("@stylistic/eslint-plugin");
const  parser = require("@html-eslint/parser");
const  path =require("path");
const  js = require("@eslint/js");
const  { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [{
    ignores: ["**/dist", "**/.turbo", "src/out", "**/node_modules", "src/docs", "eslint.config.js"],
}, {
    files: ["**/*.js"],

    plugins: {
        "@html-eslint": htmlEslint,
        "@stylistic": stylistic,
    },

    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "@html-eslint/indent": ["error", 2],
        "@html-eslint/element-newline": ["error", {
            skip: ["pre", "code"],
        }],
        "@html-eslint/lowercase": "error",
        "@html-eslint/no-extra-spacing-attrs": "error",
        "@html-eslint/no-multiple-empty-lines": "error",
        "@html-eslint/no-trailing-spaces": "error",
        "@html-eslint/quotes": "error",
        "@html-eslint/no-duplicate-class": "error",
        "@stylistic/indent": ["error", 2],
        "@stylistic/quote-props": ["error", "as-needed"],
        "@stylistic/curly-newline": ["error", "always"],
        "@stylistic/padded-blocks": ["error", "never"],
        "@stylistic/lines-around-comment": "off",
        "@stylistic/space-before-function-paren": ["error", "never"],
        "@stylistic/function-call-argument-newline": ["error", "consistent"],
        "@stylistic/object-curly-newline": ["error", {
            minProperties: 1,
        }],
   
    },
}, ...compat.extends("plugin:@html-eslint/recommended-legacy").map(config => ({
    ...config,
    files: ["**/*.html"],
})), {
    files: ["**/*.html"],
    plugins: {
        "@html-eslint": htmlEslint
    },
    languageOptions: {
        parser: parser,
    },

    rules: {
        "@html-eslint/indent": ["error", 2],
        "@html-eslint/require-doctype": "off",
        "@html-eslint/no-target-blank": "error",
        "@html-eslint/require-button-type": "error",
        "@html-eslint/require-meta-charset": "error",
        "@html-eslint/require-meta-description": "error",
        "@html-eslint/no-abstract-roles": "error",
        "@html-eslint/no-aria-hidden-body": "error",
        "@html-eslint/no-aria-hidden-on-focusable": "error",
        "@html-eslint/no-positive-tabindex": "error",
        "@html-eslint/require-frame-title": "error",
        "@html-eslint/id-naming-convention": ["error", "kebab-case"],
        "@html-eslint/no-multiple-empty-lines": "error",
        "@html-eslint/no-trailing-spaces": "error",
        "@html-eslint/no-duplicate-class": "error",
        "@html-eslint/class-spacing": "error",
        "@html-eslint/no-obsolete-attrs": "error",
        "@html-eslint/css-no-empty-blocks": "error"
    },
}];