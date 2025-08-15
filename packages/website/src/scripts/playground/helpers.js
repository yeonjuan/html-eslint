/**
 * @import {Position} from "codemirror";
 * @import eslint from "eslint";
 */
import {
  html
} from "@html-kit/html";

/**
 * @param {number} pos
 * @returns {number}
 */
function toMarkerPos(pos) {
  return pos - 1;
}

/**
 * @param {eslint.Linter.LintMessage} message
 * @returns {[Position, Position]}
 */
export function toMarker(message) {
  const from = {
    line: toMarkerPos(message.line),
    ch: toMarkerPos(message.column)
  };
  const to = {
    line: toMarkerPos(message.endLine || message.line),
    ch: toMarkerPos(message.endColumn || message.column)
  };
  return [
    from,
    to
  ];
}

/**
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const INITIAL_HTML = html`<!doctype html>
  <html>
    <head>
    </head>
    <body>
      <div>
        <li> foo </li>
      </div>
    </body>
  </html>
`;

export const INITIAL_JAVASCRIPT = `html\`
    <div>
        <span>
    </span>
    </div>
\`

const html = /*html*/\`
<div>
    <span>
       </span>
</div>
\`;`;

export const INITAIL_CONFIG = JSON.stringify(
  {
    rules: {
      "@html-eslint/indent": "error"
    }
  },
  null,
  2
);

/**
 * @param {string} language
 */
export function getInitialCode(language) {
  if (language === "javascript") {
    return INITIAL_JAVASCRIPT;
  }
  return INITIAL_HTML;
}
