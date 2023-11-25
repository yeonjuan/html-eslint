# require-title

This rule enforces to use `<title>` tag in `<head>`.

## Why?

- **Browser Tab/Window Title**
  - The primary purpose of the `<title>` tag is to define the title of the HTML document. The text within the `<title>` tag is displayed in the title bar of the web browser or as the tab name, providing a quick and easily identifiable reference to the page for users.
- **Search Engine Optimization (SEO)**
  - Search engines use the title of a page as one of the key factors in determining the content and relevance of the page to a user's search query. A descriptive and accurate title can improve search engine ranking and make it more likely that users will click on your page in search results.
- **Browser History**
  - The title of a page is also recorded in the browser's history. This makes it easier for users to identify and locate previously visited pages.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-title": "error",
  },
};
```

## Rule Details

This rule enforces `<title>` tag in the `<head>`.

Examples of **incorrect** code for this rule:

```html
<html>
  <head> </head>
</html>
```

```html
<html>
  <head>
    <title> </title>
  </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <title>Site Title</title>
  </head>
</html>
```

## Further Reading

- [MDN - title](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
