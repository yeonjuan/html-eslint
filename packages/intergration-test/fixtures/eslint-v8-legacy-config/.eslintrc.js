const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");
module.exports = {
    overrides: [
        {
            files: ["**/*.js"],
            plugins: ["@html-eslint"],
            parserOptions: {
                ecmaVersion: 6
            },
            rules: {
                "@html-eslint/indent": ["error", 2],
            }
        },
        {
            files: ["**/*.html"],
            parser: "@html-eslint/parser",
            parserOptions: {
                templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR
            },
            plugins: ["@html-eslint"],
            rules: {
                "@html-eslint/indent": ["error", 2],
                "@html-eslint/sort-attrs": ["error"],
                "@html-eslint/quotes": ["error"]
            }
        }
    ]
}