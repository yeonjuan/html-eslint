/**
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 * @typedef {import("codemirror").Position} Position
 */

/**
 * @param {number} pos
 * @returns {number}
 */
function toMarkerPos(pos) {
  return pos - 1;
}

/**
 * @param {LintMessage} message
 * @returns {[Position, Position]}
 */
export function toMarker(message) {
  const from = {
    line: toMarkerPos(message.line),
    ch: toMarkerPos(message.column),
  };
  const to = {
    line: toMarkerPos(message.endLine || message.line),
    ch: toMarkerPos(message.endColumn || message.column),
  };
  return [from, to];
}

function parseHash() {
  const decoded = decodeURIComponent(
    escape(window.atob(window.location.hash.substring(1)))
  );
  return JSON.parse(decoded);
}

const INITIAL_HTML = /* html */ `<!DOCTYPE html>
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

const INITAIL_CONFIG = JSON.stringify(
  { rules: { "@html-eslint/indent": "error" } },
  null,
  2
);

/**
 * @returns {{code: string, configs: string}}
 */
export function getInitial() {
  try {
    const { code, config } = parseHash();
    return {
      code: code || INITIAL_HTML,
      config: config || INITAIL_CONFIG,
    };
  } catch (e) {
    return {
      code: INITIAL_HTML,
      config: INITAIL_CONFIG,
    };
  }
}
