/**
 * @import {Position} from "codemirror";
 * @import eslint from "eslint";
 */

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
