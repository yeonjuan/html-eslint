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
  if (!node.attributes || node.attributes.length <= 0) {
    return false;
  }
  return node.attributes.some(attr => attr.key && attr.key.value === "charset");
}

/**
 * Check if a tag has a name attribute equal to "viewport".
 * @param {Tag} node
 * @returns {boolean}
 */
function isViewport(node) {
  if (!node.attributes || node.attributes.length <= 0) {
    return false;
  }
  const nameAttr = findAttr(node, "name");
  return !!(nameAttr && nameAttr.value && nameAttr.value.value === "viewport");
}

/**
 * Check if a link tag has rel="canonical".
 * @param {Tag} node
 * @returns {boolean}
 */
function isCanonicalLink(node) {
  if (!node.attributes || node.attributes.length <= 0) {
    return false;
  }
  const relAttr = findAttr(node, "rel");
  const hrefAttr = findAttr(node, "href");
  return !!(relAttr && relAttr.value && relAttr.value.value === "canonical" && hrefAttr);
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
    let insideHead = false;

    /**
     * @param {Map<string, Tag[]>} map
     */
    function createTagVisitor(map) {
      /**
       * @param {Tag} node
       */
      return function (node) {
        const tagName = node.name.toLowerCase();

        if (tagName === "head") {
          insideHead = true;
          return;
        }

        if (tagName === "/head") {
          insideHead = false;
          return;
        }

        if (!insideHead) return;

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

    return {
      Tag: createTagVisitor(htmlTagsMap),
      "Document:exit"() {
        report(htmlTagsMap);
      },
      TaggedTemplateExpression(node) {
        const tagsMap = new Map();
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parse(node.quasi, getSourceCode(context), {
            Tag: createTagVisitor(tagsMap),
          });
        }
        report(tagsMap);
      },
      TemplateLiteral(node) {
        const tagsMap = new Map();
        let templateInsideHead = false;
        if (shouldCheckTemplateLiteral(node, context)) {
          parse(node, getSourceCode(context), {
            Tag: createTagVisitor(tagsMap),
          });
        }
        report(tagsMap);
      },
    };
  },
};