import html from '@html-eslint/eslint-plugin-svelte';
import svelteParser from "svelte-eslint-parser";

export default [
    {
        files: ["svelte/*.svelte"],
        plugins: {
            html
        },
        languageOptions: {
            parser: svelteParser,
        },
        rules: {
            "html/class-spacing": "error",
        }
    },
];
