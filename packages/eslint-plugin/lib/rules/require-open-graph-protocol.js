/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { filter } = require("./utils/array");
const { findAttr } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

const DEFAULT_REQUIRED_PROPERTIES = [
  "og:title",
  "og:type",
  "og:url",
  "og:image",
];

/**
 * @param {string[]} properties
 * @returns {string[]}
 */
function normalize(properties) {
  return properties.map((prop) => {
    if (prop.indexOf("og:") === 0) return prop;
    return `og:${prop}`;
  });
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Enforce to use `<meta name="viewport">` in `<head>`',
      category: RULE_CATEGORY.SEO,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        type: "array",
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING]:
        "Require use of meta tags for OGP. ({{properties}})",
      [MESSAGE_IDS.EMPTY]: "Unexpected empty 'content' attribute",
    },
  },

  create(context) {
    /**
     * @type {string[]}
     */
    const requiredProperties = normalize(
      (context.options && context.options[0]) || DEFAULT_REQUIRED_PROPERTIES
    );

    /**
     * @param {import("../types").ChildType<TagNode>} node
     * @returns {node is TagNode}
     */
    function isOgpMeta(node) {
      const isMeta = node.type === NODE_TYPES.Tag && node.name === "meta";
      const property = isMeta ? findAttr(node, "property") : undefined;
      const hasOgProperty =
        !!property &&
        !!property.value &&
        property.value.value.indexOf("og:") === 0;
      return hasOgProperty;
    }

    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }
        const children = node.children;

        const metaTags = filter(children, isOgpMeta);

        const missingProperties = requiredProperties.filter((required) => {
          return !metaTags.some((meta) => {
            const property = findAttr(meta, "property");
            if (property && property.value) {
              return property.value.value === required;
            }
            return false;
          });
        });

        const emptyContentMetaTags = metaTags.filter((meta) => {
          const property = findAttr(meta, "property");
          if (
            property &&
            property.value &&
            requiredProperties.includes(property.value.value)
          ) {
            const content = findAttr(meta, "content");
            return !content || !content.value || !content.value.value;
          }
          return false;
        });

        if (missingProperties.length) {
          context.report({
            node,
            data: {
              properties: missingProperties.join(", "),
            },
            messageId: MESSAGE_IDS.MISSING,
          });
        }

        if (emptyContentMetaTags.length) {
          emptyContentMetaTags.forEach((meta) => {
            const content = findAttr(meta, "content");
            context.report({
              node: content || meta,
              messageId: MESSAGE_IDS.EMPTY,
            });
          });
        }
      },
    };
  },
};
