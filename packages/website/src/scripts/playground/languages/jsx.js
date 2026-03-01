/**
 * @import {Language} from './types';
 */

/**
 * @type {Language}
 */
export const languageJSX = {
  key: "jsx",
  mime: 'text/jsx',
  initialCode: `const Component = () => {
    return <a rel="no referrer">link</a>;
}`,
  initialConfig: {
    rules: {
      "@html-eslint/react/use-baseline": "error",
      "@html-eslint/react/no-invalid-attr-value": "error"
    }
  },
  isEqual(lang) {
    return lang === "jsx";
  },
}