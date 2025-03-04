/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("@html-eslint/types").AttributeValue } AttributeValue
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr, isScript } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @param {string} url
 */
function getProtocol(url) {
  try {
    return new URL(url).protocol;
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    return null;
  }
}

/**
 * @param {Tag | ScriptTag} node
 * @returns {AttributeValue | undefined}
 */
function getResourceAttributeValue(node) {
  /**
   * @type {Attribute | undefined}
   */
  let attribute;
  if (isScript(node)) {
    attribute = findAttr(node, "src");
  } else {
    switch (node.name.toLowerCase()) {
      case "img":
      case "iframe":
      case "audio":
      case "video":
      case "source":
      case "embed": {
        attribute = findAttr(node, "src");
        break;
      }
      case "link": {
        attribute = findAttr(node, "href");
        break;
      }
      case "object": {
        attribute = findAttr(node, "data");
        break;
      }
    }
  }
  if (attribute) {
    return attribute.value;
  }
  return undefined;
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Prefer to use HTTPS for embedded resources",
      recommended: false,
      category: RULE_CATEGORY.BEST_PRACTICE,
    },
    fixable: false,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use 'HTTP' protocol.",
    },
  },

  create(context) {
    /**
     * @param {Tag | ScriptTag} node
     */
    function check(node) {
      const attributeValue = getResourceAttributeValue(node);
      if (attributeValue && !attributeValue.parts.length) {
        const protocol = getProtocol(attributeValue.value);
        if (protocol === "http:") {
          context.report({
            node: attributeValue,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      }
    }

    return createVisitors(context, {
      ScriptTag: check,
      Tag: check,
    });
  },
};
