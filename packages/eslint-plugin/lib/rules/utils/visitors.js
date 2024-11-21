/**
 * @typedef { import("../../types").RuleListener } RuleListener
 * @typedef { import("../../types").Context } Context
 */

const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./settings");
const { parse } = require("@html-eslint/template-parser");
const { getSourceCode } = require("./source-code");

/**
 * @param {RuleListener} visitors
 * @param {Context} context
 * @returns {RuleListener}
 */
function createVisitors(visitors, context) {
  return {
    ...visitors,
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

module.exports = {
  createVisitors,
};
