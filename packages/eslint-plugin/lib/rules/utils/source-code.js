/**
 * @import {Context} from "../../types";
 */

/**
 * @param {Context<any[]>} context
 */
function getSourceCode(context) {
  return context.sourceCode || context.getSourceCode();
}

module.exports = {
  getSourceCode,
};
