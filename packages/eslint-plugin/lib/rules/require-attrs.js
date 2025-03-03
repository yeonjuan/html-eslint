/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 *
 * @typedef {Object} Option
 * @property {string} tag
 * @property {string} attr
 * @property {string} [value]
 *
 * @typedef { import("../types").RuleModule<Option[]> } RuleModule
 *
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
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
    /**
     * @type {Option[]}
     */
    const options = context.options || [];
    /**
     * @type {Map<string, { tag: string, attr: string, value?: string}[]>}
     */
    const tagOptionsMap = new Map();

    options.forEach((option) => {
      const tagName = option.tag.toLowerCase();
      if (tagOptionsMap.has(tagName)) {
        tagOptionsMap.set(tagName, [
          ...(tagOptionsMap.get(tagName) || []),
          option,
        ]);
      } else {
        tagOptionsMap.set(tagName, [option]);
      }
    });

    /**
     * @param {StyleTag | ScriptTag | Tag} node
     * @param {string} tagName
     */
    function check(node, tagName) {
      const tagOptions = tagOptionsMap.get(tagName) || [];
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

    /**
     * @param {StyleTag | ScriptTag} node
     */
    function checkStyleOrScript(node) {
      const tagName = node.type === NODE_TYPES.StyleTag ? "style" : "script";
      if (!tagOptionsMap.has(tagName)) {
        return;
      }
      check(node, tagName);
    }

    /**
     * @param {Tag} node
     */
    function checkTag(node) {
      const tagName = node.name.toLowerCase();
      if (!tagOptionsMap.has(tagName)) {
        return;
      }
      check(node, tagName);
    }

    return createVisitors(context, {
      StyleTag: checkStyleOrScript,
      ScriptTag: checkStyleOrScript,
      Tag: checkTag,
    });
  },
};
