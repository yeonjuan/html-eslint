module.exports = {
    overrides: [
        {
            files: ["**/*.js"],
            plugins: ["@html-eslint"],
            parserOptions: {
                ecmaVersion: 6
            },
            rules: {
                "@html-eslint/indent": ["error", 2]
            }
        },
        {
            files: ["**/*.html"],
            parser: "@html-eslint/parser",
            plugins: ["@html-eslint"],
            rules: {
                "@html-eslint/indent": ["error", 2]
            }
        }
    ]
}