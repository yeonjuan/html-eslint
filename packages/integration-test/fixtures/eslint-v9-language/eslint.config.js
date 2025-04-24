const html = require('@html-eslint/eslint-plugin');
const htmlParser = require('@html-eslint/parser');

module.exports = [
    {
        files: ["html/*.html"],
        plugins: {
            html
        },
        language: 'html/html',
        languageOptions: {
             templateEngineSyntax: htmlParser.TEMPLATE_ENGINE_SYNTAX.HANDLEBAR
        },
        rules: {
            "html/indent": ["error", 2],
            "html/sort-attrs": ["error"],
            "html/quotes": ["error"]
        }
    },
];