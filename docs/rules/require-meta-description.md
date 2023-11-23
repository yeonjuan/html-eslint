# require-meta-description

This rule enforces to use `<meta name="description" content="...">` tag in `<head></head>`.

## Why?

`<meta name="description" content="...">` tag, is used to provide a concise and accurate summary of a web page's content.

- **SEO**:
  - Search engines often use the meta description as a snippet in search results to give users a preview of the content on a page. A well-crafted and relevant meta description can improve click-through rates, as it provides users with a clear idea of what to expect on the page.
- **User Experience**:
  - The meta description serves as a brief summary that helps users understand the content of a page before clicking on it. This enhances the user experience by allowing visitors to make informed decisions about whether to visit the page based on their interests and needs.
- **Social Media Sharing**:
  - When a web page is shared on social media platforms, the meta description is often used as the default description. Having a well-crafted meta description ensures that the shared content provides valuable information and encourages engagement.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-meta-description": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<html>
  <head>
    <meta name="author" content="YeonJuAn" />
  </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <meta name="description" content="ESLint plugin for HTML" />
    <meta name="author" content="YeonJuAn" />
  </head>
</html>
```
