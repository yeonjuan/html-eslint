/**
 * @import {Tag} from "@html-eslint/types";
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
  DUPLICATE_TAG: "duplicateTag",
};

/**
 * Returns a formatted string representing a tag's key detail.
 * E.g., meta[charset=UTF-8], meta[name=viewport], link[rel=canonical]
 * @param {Tag} node
 * @returns {string | null}
 */
function getTrackingKey(node) {
  const tagName = node.name.toLowerCase();

  if (["title", "base"].includes(tagName)) {
    return tagName;
  }

  if (tagName === "meta") {
    const charsetAttr = findAttr(node, "charset");
    if (charsetAttr) {
      return "meta[charset]";
    }

    const nameAttr = findAttr(node, "name");
    if (nameAttr && nameAttr.value && nameAttr.value.value === "viewport") {
      return "meta[name=viewport]";
    }
  }

  if (tagName === "link") {
    const relAttr = findAttr(node, "rel");
    const hrefAttr = findAttr(node, "href");
    if (
      relAttr &&
      relAttr.value &&
      relAttr.value.value === "canonical" &&
      hrefAttr
    ) {
      return "link[rel=canonical]";
    }
  }

  return null;
}

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow duplicate tags in `<head>`",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-duplicate-in-head"),
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_TAG]: "Duplicate <{{tag}}> tag in <head>.",
    },
  },

  create(context) {
    const htmlTagsMap = new Map();
    let headCount = 0;

    /**
     * @param {Map<string, Tag[]>} map
     * @param {{count: number}|null} headCountRef
     */
    function createTagVisitor(map, headCountRef = null) {
      return {
        /**
         * @param {Tag} node
         */
        Tag(node) {
          const tagName = node.name.toLowerCase();

          if (tagName === "head") {
            if (headCountRef !== null) {
              headCountRef.count++;
            } else {
              headCount++;
            }
            return;
          }

          const currentHeadCount =
            headCountRef !== null ? headCountRef.count : headCount;
          if (currentHeadCount === 0) return;

          const trackingKey = getTrackingKey(node);
          if (typeof trackingKey !== "string") return;

          if (!map.has(trackingKey)) {
            map.set(trackingKey, []);
          }

          const nodes = map.get(trackingKey);
          if (nodes) {
            nodes.push(node);
          }
        },

        /**
         * @param {Tag} node
         */
        "Tag:exit"(node) {
          const tagName = node.name.toLowerCase();
          if (tagName === "head") {
            if (headCountRef !== null) {
              headCountRef.count--;
            } else {
              headCount--;
            }
          }
        },
      };
    }

    /**
     * @param {Map<string, Tag[]>} map
     */
    function report(map) {
      map.forEach((tags, tagKey) => {
        if (Array.isArray(tags) && tags.length > 1) {
          tags.slice(1).forEach((tag) => {
            context.report({
              node: tag,
              data: { tag: tagKey },
              messageId: MESSAGE_IDS.DUPLICATE_TAG,
            });
          });
        }
      });
    }

    const htmlVisitor = createTagVisitor(htmlTagsMap);

    return {
      Tag: htmlVisitor.Tag,
      "Tag:exit": htmlVisitor["Tag:exit"],

      "Document:exit"() {
        report(htmlTagsMap);
      },

      TaggedTemplateExpression(node) {
        const tagsMap = new Map();
        const headCountRef = { count: 0 };

        if (shouldCheckTaggedTemplateExpression(node, context)) {
          const visitor = createTagVisitor(tagsMap, headCountRef);
          parseTemplateLiteral(node.quasi, getSourceCode(context), visitor);
          report(tagsMap);
        }
      },

      TemplateLiteral(node) {
        const tagsMap = new Map();
        const headCountRef = { count: 0 };

        if (shouldCheckTemplateLiteral(node, context)) {
          const visitor = createTagVisitor(tagsMap, headCountRef);
          parseTemplateLiteral(node, getSourceCode(context), visitor);
          report(tagsMap);
        }
      },
    };
  },
};
