/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING: "missing",
};

function dedupe(arr) {
  return arr.filter((item, index, self) => self.indexOf(item) === index);
}

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },
    fixable: null,
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tag: { type: "string" },
          attrs: {
            type: "array",
            items: {
              type: "string",
            },
            additionalProperties: false,
          },
        },
        required: ["tag", "attrs"],
        additionalProperties: false,
      },
    },
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing {{attrs}} attributes for {{tag}} tag",
    },
  },

  create(context) {
    const options = context.options || [];
    const attrsMap = new Map();

    options.forEach((option) => {
      const key = option.tag.toLowerCase();
      const attrs = dedupe(option.attrs);
      if (attrsMap.has(key)) {
        attrsMap.set(key, dedupe([...attrsMap.get(key), attrs]));
      } else {
        attrsMap.set(key, attrs);
      }
    });

    return {
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        const tagName = node.name.toLocaleLowerCase();
        if (!attrsMap.has(tagName)) {
          return;
        }
        const requiredAttrs = attrsMap.get(tagName);
        const attributes = (node.attributes || []).map(
          (attr) => attr.key && attr.key.value
        );

        const missingAttrs = requiredAttrs.filter(
          (attr) => !attributes.includes(attr)
        );

        if (missingAttrs.length) {
          context.report({
            messageId: MESSAGE_IDS.MISSING,
            node: node,
            data: {
              attrs: missingAttrs.map((attr) => `'${attr}'`).join(", "),
              tag: `'${tagName}'`,
            },
          });
        }
      },
    };
  },
};
