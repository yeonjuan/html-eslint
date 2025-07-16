/**
 * @import {Context, RuleListener} from "../../types";
 */

const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./settings");
const { getCachedParseResult } = require("./template-cache");
const { traverse } = require("@html-eslint/template-parser/lib/traverser");
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
        const { ast } = getCachedParseResult(
          node.quasi,
          getSourceCode(context)
        );
        traverse(ast, visitors, null);
      }
    },
    TemplateLiteral(node) {
      if (shouldCheckTemplateLiteral(node, context)) {
        const { ast } = getCachedParseResult(node, getSourceCode(context));
        traverse(ast, visitors, null);
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
