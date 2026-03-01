const angularPlugin = require('@html-eslint/eslint-plugin-angular-template');
const templateParser = require('@angular-eslint/template-parser');

module.exports = [
    {
        files: ["templates/*.html"],
        plugins: {
            "@html-eslint/angular-template": angularPlugin,
        },
        languageOptions: {
            parser: templateParser,
        },
        rules: {
            "@html-eslint/angular-template/use-baseline": ["error", { available: 2019 }],
        }
    },
];
