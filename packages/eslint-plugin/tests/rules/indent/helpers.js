/**
 * @param {number} length
 * @returns
 */
function wrongIndentErrors(length) {
  return Array.from({ length }, () => ({
    messageId: "wrongIndent",
  }));
}

module.exports = {
  wrongIndentErrors,
};
