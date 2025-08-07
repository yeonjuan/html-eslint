/**
 * @import {Tag, AttributeValue} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { parseTemplateLiteral } = require("./utils/template-literal");
const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow duplicate id attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-duplicate-id"),
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
     * @param {Map<string, AttributeValue[]>} map
     */
    function createTagVisitor(map) {
      /**
       * @param {Tag} node
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
     * @param {Map<string, AttributeValue[]>} map
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
      "Document:exit"() {
        report(htmlIdAttrsMap);
      },
      TaggedTemplateExpression(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parseTemplateLiteral(node.quasi, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap);
      },
      TemplateLiteral(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTemplateLiteral(node, context)) {
          parseTemplateLiteral(node, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap);
      },
    };
  },
};
