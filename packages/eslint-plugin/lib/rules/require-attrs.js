/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

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
          attr: { type: "string" },
          value: { type: "string" },
        },
        required: ["tag", "attr"],
        additionalProperties: false,
      },
    },
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing '{{attr}}' attributes for '{{tag}}' tag",
      [MESSAGE_IDS.UNEXPECTED]:
        "Unexpected '{{attr}}' attributes value. '{{expected}}' is expected",
    },
  },

  create(context) {
    const options = context.options || [];
    const tagOptionsMap = new Map();

    options.forEach((option) => {
      const tagName = option.tag.toLowerCase();
      if (tagOptionsMap.has(tagName)) {
        tagOptionsMap.set(tagName, [...tagOptionsMap.get(tagName), option]);
      } else {
        tagOptionsMap.set(tagName, [option]);
      }
    });

    function check(node, tagName) {
      const tagOptions = tagOptionsMap.get(tagName);
      const attributes = node.attributes || [];

      tagOptions.forEach((option) => {
        const attrName = option.attr;
        const attr = attributes.find(
          (attr) => attr.key && attr.key.value === attrName
        );
        if (!attr) {
          context.report({
            messageId: MESSAGE_IDS.MISSING,
            node,
            data: {
              attr: attrName,
              tag: tagName,
            },
          });
        } else if (
          typeof option.value === "string" &&
          (!attr.value || attr.value.value !== option.value)
        ) {
          context.report({
            messageId: MESSAGE_IDS.UNEXPECTED,
            node: attr,
            data: {
              attr: attrName,
              expected: option.value,
            },
          });
        }
      });
    }

    return {
      [["StyleTag", "ScriptTag"].join(",")](node) {
        const tagName = node.type === "StyleTag" ? "style" : "script";
        if (!tagOptionsMap.has(tagName)) {
          return;
        }
        check(node, tagName);
      },
      Tag(node) {
        const tagName = node.name.toLowerCase();
        if (!tagOptionsMap.has(tagName)) {
          return;
        }
        check(node, tagName);
      },
    };
  },
};
