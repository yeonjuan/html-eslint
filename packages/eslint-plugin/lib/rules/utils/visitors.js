/**
 * @import {Context, RuleListener} from "../../types";
 */

const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./settings");
const { parseTemplateLiteral } = require("./template-literal");
const { getSourceCode } = require("./source-code");

/**
 * @param {Context<any[]>} context
 * @param {any} visitors
 * @returns {RuleListener}
 */
function createTemplateVisitors(context, visitors) {
  return {
    TaggedTemplateExpression(node) {
      if (shouldCheckTaggedTemplateExpression(node, context)) {
        parseTemplateLiteral(node.quasi, getSourceCode(context), visitors);
      }
    },
    TemplateLiteral(node) {
      if (shouldCheckTemplateLiteral(node, context)) {
        parseTemplateLiteral(node, getSourceCode(context), visitors);
      }
    },
  };
}

/**
 * @param {Context<any[]>} context
 * @param {RuleListener} visitors
 * @param {any} [templateVisitors]
 * @returns {RuleListener}
 */
function createVisitors(context, visitors, templateVisitors) {
  const tmplVisitors = createTemplateVisitors(
    context,
    templateVisitors || visitors
  );
  return {
    ...visitors,
    ...tmplVisitors,
  };
}

module.exports = {
  createVisitors,
};
