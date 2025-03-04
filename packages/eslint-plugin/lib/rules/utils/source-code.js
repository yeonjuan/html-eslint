/**
 * @typedef {import("../../types").Context<any[]>} Context
 */

/**
 * @param {Context} context
 */
function getSourceCode(context) {
  return context.sourceCode || context.getSourceCode();
}

module.exports = {
  getSourceCode,
};
