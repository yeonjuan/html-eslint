/**
 * @import {
 *   AttributeValue,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 * @typedef {Map<Tag | null, Map<string, AttributeValue[]>>} IdAttrsMap
 */

const { parseTemplateLiteral } = require("./utils/template-literal");
const { RULE_CATEGORY } = require("../constants");
const { findAttr, findParent, isTag, getNameOf } = require("./utils/node");
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
    // gracefully to the original behavior.
    const branchSegments = getBranchSegments(context);

    /** @type {IdAttrsMap} */
    const htmlIdAttrsMap = new Map();

    /**
     * Ids only need to be unique within one node tree. The content of a
     * `<template>` (including a declarative shadow root) is its own tree, so
     * ids are grouped by their nearest `<template>` ancestor.
     *
     * @param {Tag} node
     * @returns {Tag | null}
     */
    function getTreeRoot(node) {
      return /** @type {Tag | null} */ (
        findParent(
          node,
          (parent) => isTag(parent) && getNameOf(parent) === "template"
        )
      );
    }

    /** @param {IdAttrsMap} map */
    function createTagVisitor(map) {
      /** @param {Tag} node */
      return function (node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = findAttr(node, "id");
        if (idAttr?.value) {
          const root = getTreeRoot(node);
          let idMap = map.get(root);
          if (!idMap) {
            idMap = new Map();
            map.set(root, idMap);
          }
          let nodes = idMap.get(idAttr.value.value);
          if (!nodes) {
            nodes = [];
            idMap.set(idAttr.value.value, nodes);
          }
          nodes.push(idAttr.value);
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

    /**
     * @param {IdAttrsMap} map
     * @param {typeof branchSegments} segments
     */
    function reportAll(map, segments) {
      map.forEach((idMap) => report(idMap, segments));
    }

    return {
      Tag: createTagVisitor(htmlIdAttrsMap),
      "Document:exit"() {
        reportAll(htmlIdAttrsMap, branchSegments);
      },
      TaggedTemplateExpression(node) {
        /** @type {IdAttrsMap} */
        const idAttrsMap = new Map();
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parseTemplateLiteral(node.quasi, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        reportAll(idAttrsMap, branchSegments);
      },
      TemplateLiteral(node) {
        /** @type {IdAttrsMap} */
        const idAttrsMap = new Map();
        if (shouldCheckTemplateLiteral(node, context)) {
          parseTemplateLiteral(node, getSourceCode(context), {
            Tag: createTagVisitor(idAttrsMap),
          });
        }
        reportAll(idAttrsMap, branchSegments);
      },
    };
  },
};
