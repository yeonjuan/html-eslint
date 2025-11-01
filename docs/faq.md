# FAQs

## How to use HTML ESLint with other plugins like eslint-plugin-html?

When using HTML ESLint alongside other plugins that process HTML files (such as `eslint-plugin-html` for linting JavaScript inside HTML), you need to use separate configuration files. This is because different parsers and processing approaches conflict when applied to the same files.

See the [Using HTML ESLint with Other Plugins](./using-with-other-plugins.md) guide for detailed instructions and examples.

## Problem when using typescript-eslint typed linting.

```
Error: Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file....
Parser: @html-eslint/parser
```

When using [typescript-eslint Typed-Linting](https://typescript-eslint.io/troubleshooting/typed-linting), the above error may occur for HTML files. In this case, disable typed-linting rules for HTML.

```js
export default tseslint.config(
  //...,
  {
    files: ["**/*.html"],
    extends: [tseslint.configs.disableTypeChecked],
  }
  // ...
);
```
