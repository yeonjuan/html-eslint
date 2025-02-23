module.exports = {
    overrides: [
        {
            files: ["**/*.html"],
            parser: "@html-eslint/parser",
            processor: "@html-eslint/frontmatter",
            plugins: ["@html-eslint"],
            rules: {
                "@html-eslint/indent": ["error", 4]
            }
        }
    ]
}