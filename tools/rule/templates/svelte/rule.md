# {ruleName}

## How to use

```js,.eslintrc.js
import svelteParser from "svelte-eslint-parser";
export default  [
 {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    languageOptions: {
      parser: svelteParser,
    },
    rules: {
         "@html-eslint/svelte/{ruleName}": "error",
    },
  },
];
```

## Rule Details
