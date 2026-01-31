/** @import {Context} from "../../types" */

/** @param {Context<any[]>} context */
function getSourceCode(context) {
  return (
    context.sourceCode ||
    /**
     * @type {Context<any[]> & {
     *   getSourceCode(): Context<any>["sourceCode"];
     * }}
     */ (context).getSourceCode()
  );
}

module.exports = {
  getSourceCode,
};
