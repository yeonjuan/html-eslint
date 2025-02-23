/**
 * @typedef { import('eslint').Linter.Processor } Processor
 */

/**
 * @param {string} text
 * @returns {boolean}
 */
function hasOpenFrontmatter(text) {
  return /^---[\r|\n|\r\n]/.test(text);
}

/**
 * @param {string} text
 * @returns {number | null}
 */
function indexOfCloseFrontmatter(text) {
  const endExpExec = /^---[\r|\n|\r\n]/m.exec(text.slice(3));
  if (!endExpExec) {
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
  return text.split(/[\r|\n|\r\n]/).length - 1;
}

/**
 * @type {number | null}
 */
let frontmatterCloseIndex = null;
let frontmatterLines = 0;

/**
 * @type {Processor}
 */
module.exports = {
  supportsAutofix: false,
  preprocess(text) {
    if (hasOpenFrontmatter(text)) {
      frontmatterCloseIndex = indexOfCloseFrontmatter(text);
      if (typeof frontmatterCloseIndex === "number") {
        frontmatterLines = countLines(text.slice(0, frontmatterCloseIndex));
        return [text.slice(frontmatterCloseIndex)];
      }
    }
    return [text];
  },
  postprocess(messagesArray) {
    const messages = messagesArray[0];
    if (typeof frontmatterCloseIndex === "number") {
      for (const message of messages) {
        message.line += frontmatterLines;
        if ("endLine" in message && typeof message.endLine === "number") {
          message.endLine += frontmatterLines;
        }
      }
    }
    frontmatterCloseIndex = null;

    // @ts-ignore
    return [].concat(...messagesArray);
  },
};
