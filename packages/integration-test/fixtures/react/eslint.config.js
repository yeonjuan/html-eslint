const html = require('@html-eslint/eslint-plugin-react');

module.exports = [
    {
        files: ["jsx/*.jsx"],
        plugins: {
            html,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
        },
    },
    html.configs.recommended
];
