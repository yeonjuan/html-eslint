/**
 * @typedef { import("../../types").Context<any[]> } Context
 * @typedef { import("../../types").RuleListener } RuleListener
 */

const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./settings");
const { parse } = require("@html-eslint/template-parser");
const { getSourceCode } = require("./source-code");

/**
 * @param {Context} context
 * @param {any} visitors
 * @returns {RuleListener}
 */
function createTemplateVisitors(context, visitors) {
  return {
    TaggedTemplateExpression(node) {
      if (shouldCheckTaggedTemplateExpression(node, context)) {
        parse(node.quasi, getSourceCode(context), visitors);
      }
    },
    TemplateLiteral(node) {
      if (shouldCheckTemplateLiteral(node, context)) {
        parse(node, getSourceCode(context), visitors);
      }
    },
  };
}

/**
 * @param {Context} context
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
