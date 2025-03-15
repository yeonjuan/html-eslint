/**
 * @typedef {Object} FrontmatterResult
 * @property {number} FrontmatterResult.index
 * @property {number} FrontmatterResult.line
 * @property {string} FrontmatterResult.html
 */

/**
 * @param {string} text
 * @returns {boolean}
 */
function startsWithFrontmatter(text) {
  return /^[\n|\r\n]*---[\n|\r\n]/.test(text);
}

/**
 * @param {string} text
 * @returns {number | null}
 */
function indexOfEndFrontmatter(text) {
  const rest = text.slice(3);
  const endExpExec = /([\n|\r\n]---\s*[\n|\r\n]?)/.exec(rest);

  if (!endExpExec) {
    return null;
  }
  if (/([\n|\r\n]---[\S]+)/.exec(rest)) {
    return null;
  }

  const end = endExpExec.index + endExpExec[0].length;
  return end + 3;
}

/**
 * @param {string} text
 * @returns {number}
 */
function countLines(text) {
  return text.split("\n").length;
}

/**
 * @param {string} text
 * @returns {FrontmatterResult | null}
 */
function parseFrontmatterContent(text) {
  if (!startsWithFrontmatter(text)) {
    return null;
  }
  const end = indexOfEndFrontmatter(text);

  if (!end) {
    return null;
  }
  const line = countLines(text.slice(0, end));

  return {
    index: end,
    line: line,
    html: text.slice(end),
  };
}

module.exports = {
  parseFrontmatterContent,
};
