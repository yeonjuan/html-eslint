const html = require('@html-eslint/eslint-plugin');
const htmlParser = require('@html-eslint/parser');

module.exports = [
    {
        files: ["handlebar/*.html"],
        plugins: {
            html
        },
        languageOptions: {
            parser: htmlParser,
            parserOptions: {
                templateEngineSyntax: htmlParser.TEMPLATE_ENGINE_SYNTAX.HANDLEBAR
            }
        },
        rules: {
            "html/indent": ["error", 2],
            "html/quotes": ["error"],
            "html/no-duplicate-attrs": ["error"],
            "html/no-duplicate-id": ["error"],
            "html/no-inline-styles": ["error"],
        }
    }
];
