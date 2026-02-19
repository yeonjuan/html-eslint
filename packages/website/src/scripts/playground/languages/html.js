/**
 * @import {Language} from './types';
 */
import {
  html
} from "@html-kit/html";
/**
 * @type {Language}
 */
export const languageHTML = {
  key: "html",
  mime: 'text/html',
  initialCode:  html`<!doctype html>
    <html lang="en-US">
      <head>
      </head>
      <body>
        <div>
          <li> foo </li>
        </div>
      </body>
    </html>
    `,
  initialConfig: {
    rules: {
      "@html-eslint/indent": "error"
    }
  },
  isEqual(lang) {
    return lang === "html";
  },
}