const angularPlugin = require('@html-eslint/eslint-plugin-angular');
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
        rules: angularPlugin.configs.recommended.rules,
    },
];
