/**
 * @import {
 *   AttributeValue,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
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
const {
  getBranchSegments,
  areInMutuallyExclusiveBranches,
} = require("./utils/branch-segments");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

/** @type {RuleModule<[]>} */
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
    // Read branch segments once per file.  For non-HTML files (JS tagged
    // template literal paths) this will be [] and the check degrades
    // gracefully to the original behaviour.
    const branchSegments = getBranchSegments(context);

    const htmlIdAttrsMap = new Map();

    /** @param {Map<string, AttributeValue[]>} map */
    function createTagVisitor(map) {
      /** @param {Tag} node */
      return function (node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = findAttr(node, "id");
        if (idAttr?.value) {
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
     * @param {Map<string, AttributeValue[]>} map
     * @param {typeof branchSegments} segments
     */
    function report(map, segments) {
      map.forEach((attrs) => {
        if (Array.isArray(attrs) && attrs.length > 1) {
          // If every occurrence lives in a different branch of the same
          // template if-block they are mutually exclusive at runtime — the
          // same id can never appear twice in the rendered output.
          if (areInMutuallyExclusiveBranches(attrs, segments)) {
            return;
          }
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
        report(htmlIdAttrsMap, branchSegments);
      },
      TaggedTemplateExpression(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parseTemplateLiteral(node.quasi, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap, branchSegments);
      },
      TemplateLiteral(node) {
        const idAttrsMap = new Map();
        if (shouldCheckTemplateLiteral(node, context)) {
          parseTemplateLiteral(node, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        report(idAttrsMap, branchSegments);
      },
    };
  },
};
