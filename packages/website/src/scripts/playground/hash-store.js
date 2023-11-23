/**
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 */

/**
 * @param {string} code
 * @param {string} rules
 */
export function update(code, configs) {
  const uri = window.btoa(
    unescape(encodeURIComponent(JSON.stringify({ code, configs })))
  );
  window.location.hash = uri;
}

/**
 * @returns {{code: string, ruls: string}}
 */
export function get() {
  const decoded = decodeURIComponent(
    escape(window.atob(window.location.hash.substring(1)))
  );
  return JSON.parse(decoded);
}
