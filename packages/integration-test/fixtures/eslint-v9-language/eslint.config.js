const html = require('@html-eslint/eslint-plugin');
const htmlParser = require('@html-eslint/parser');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
    {
        files: ["html/*.html"],
        plugins: {
            html
        },
        language: 'html/html',
        extends: ["html/recommended"],
        languageOptions: {
             templateEngineSyntax: htmlParser.TEMPLATE_ENGINE_SYNTAX.HANDLEBAR
        },
        rules: {
            "html/indent": ["error", 2],
            "html/sort-attrs": ["error"],
            "html/quotes": ["error"]
        }
    },
    {
        files: ["frontmatter/*.html"],
        plugins: {
            html
        },
        language: 'html/html',
        languageOptions: {
            frontmatter: true,
            templateEngineSyntax: htmlParser.TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
        rules: {
            "html/no-duplicate-class": "error",
        }
    },
]);
