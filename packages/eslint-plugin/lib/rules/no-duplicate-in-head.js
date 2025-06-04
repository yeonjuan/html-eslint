/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").AttributeValue } AttributeValue
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { parse } = require("@html-eslint/template-parser");
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
 * Check if a tag has a charset attribute.
 * @param {Tag} node
 * @returns {boolean}
 */
function hasCharset(node) {
  return !!findAttr(node, "charset");
}

/**
 * Check if a tag has a name attribute equal to "viewport".
 * @param {Tag} node
 * @returns {boolean}
 */
function isViewport(node) {
  const nameAttr = findAttr(node, "name");
  return !!(nameAttr && nameAttr.value && nameAttr.value.value === "viewport");
}

/**
 * Check if a link tag has rel="canonical".
 * @param {Tag} node
 * @returns {boolean}
 */
function isCanonicalLink(node) {
  const relAttr = findAttr(node, "rel");
  const hrefAttr = findAttr(node, "href");
  return !!(
    relAttr &&
    relAttr.value &&
    relAttr.value.value === "canonical" &&
    hrefAttr
  );
}

/**
 * @type {RuleModule}
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

          const currentHeadCount = headCountRef !== null ? headCountRef.count : headCount;
          if (currentHeadCount === 0) return;

          let trackingKey = null;

          // Track <title> and <base>
          if (["title", "base"].includes(tagName)) {
            trackingKey = tagName;
          }

          // Track <meta charset> and <meta name=viewport>
          if (tagName === "meta") {
            if (hasCharset(node)) {
              trackingKey = "meta[charset]";
            } else if (isViewport(node)) {
              trackingKey = "meta[name=viewport]";
            }
          }

          // Track <link rel=canonical>
          if (tagName === "link" && isCanonicalLink(node)) {
            trackingKey = "link[rel=canonical]";
          }

          if (trackingKey) {
            if (!map.has(trackingKey)) {
              map.set(trackingKey, []);
            }
            const nodes = map.get(trackingKey);
            if (nodes) {
              nodes.push(node);
            }
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
        }
      };
    }

    /**
     * @param {Map<string, Tag[]>} map
     */
    function report(map) {
      map.forEach((tags, tagName) => {
        if (Array.isArray(tags) && tags.length > 1) {
          tags.slice(1).forEach((tag) => {
            context.report({
              node: tag,
              data: { tag: tagName },
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
          const templateVisitor = createTagVisitor(tagsMap, headCountRef);
          parse(node.quasi, getSourceCode(context), {
            Tag: templateVisitor.Tag,
            "Tag:exit": templateVisitor["Tag:exit"],
          });
          report(tagsMap);
        }
      },
      TemplateLiteral(node) {
        const tagsMap = new Map();
        const headCountRef = { count: 0 };
        if (shouldCheckTemplateLiteral(node, context)) {
          const templateVisitor = createTagVisitor(tagsMap, headCountRef);
          parse(node, getSourceCode(context), {
            Tag: templateVisitor.Tag,
            "Tag:exit": templateVisitor["Tag:exit"],
          });
          report(tagsMap);
        }
      },
    };
  },
};