/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 * @typedef { import("es-html-parser").AttributeValueNode } AttributeValueNode
 */

const { parse } = require("@html-eslint/template-parser");
const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate id",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ID]: "The id '{{id}}' is duplicated.",
    },
  },

  create(context) {
    const htmlIdAttrsMap = new Map();
    /**
     * @param {Map<string, AttributeValueNode[]>} map
     */
    function createTagVisitor(map) {
      /**
       * @param {TagNode} node
       */
      return function (node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = findAttr(node, "id");
        if (idAttr && idAttr.value) {
          if (!map.has(idAttr.value.value)) {
            map.set(idAttr.value.value, []);
          }
          const nodes = map.get(idAttr.value.value);
          if (nodes) {
            nodes.push(idAttr.value);
          }
        }
      };
    }

    /**
     *
     * @param {Map<string, AttributeValueNode[]>} map
     */
    function report(map) {
      map.forEach((attrs) => {
        if (Array.isArray(attrs) && attrs.length > 1) {
          attrs.forEach((attr) => {
            context.report({
              node: attr,
              data: { id: attr.value },
              messageId: MESSAGE_IDS.DUPLICATE_ID,
            });
          });
        }
      });
    }

    return {
      Tag: createTagVisitor(htmlIdAttrsMap),
      "Program:exit"() {
        report(htmlIdAttrsMap);
      },
      TaggedTemplateExpression(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parse(node.quasi, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap);
      },
      TemplateLiteral(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTemplateLiteral(node, context)) {
          parse(node, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap);
      },
    };
  },
};
