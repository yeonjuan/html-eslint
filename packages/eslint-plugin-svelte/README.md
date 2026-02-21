# @html-eslint/eslint-plugin-svelte

ESLint plugin for HTML with Svelte support.

## Installation

```bash
npm install --save-dev @html-eslint/eslint-plugin-svelte
```

## Usage

### ESLint Flat Config

```js
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      // Add rules here
    },
  },
];
```

### Legacy Config

```js
module.exports = {
  plugins: ["@html-eslint/svelte"],
  rules: {
    // Add rules here
  },
};
```

## License

MIT
