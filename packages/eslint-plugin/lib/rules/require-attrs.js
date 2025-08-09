/**
 * @import {Tag, ScriptTag, StyleTag, Attribute} from "@html-eslint/types";
 * @import {RuleModule, ReportFixFunction} from "../types";
 *
 * @typedef {Object} Option
 * @property {string} tag
 * @property {string} attr
 * @property {string} [value]
 * @property {string} [message]
 *
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule<Option[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("require-attrs"),
    },
    fixable: "code",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tag: { type: "string" },
          attr: { type: "string" },
          value: { type: "string" },
          message: { type: "string" },
        },
        required: ["tag", "attr"],
        additionalProperties: false,
      },
    },
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing '{{attr}}' attribute on '{{tag}}' tag",
      [MESSAGE_IDS.UNEXPECTED]:
        "Unexpected '{{attr}}' attribute value. '{{expected}}' is expected",
    },
  },

  create(context) {
    /**
     * @type {Option[]}
     */
    const options = context.options || [];
    /**
     * @type {Map<string, { tag: string, attr: string, value?: string, message?: string}[]>}
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
            ...(option.message
              ? { message: option.message }
              : { messageId: MESSAGE_IDS.MISSING }),
            node,
            data: {
              attr: attrName,
              tag: tagName,
            },
            fix(fixer) {
              if (!option.value) {
                return null;
              }
              return fixer.insertTextAfter(
                node.openStart,
                ` ${attrName}="${option.value}"`
              );
            },
          });
        } else if (
          typeof option.value === "string" &&
          (!attr.value || attr.value.value !== option.value)
        ) {
          context.report({
            ...(option.message
              ? { message: option.message }
              : { messageId: MESSAGE_IDS.UNEXPECTED }),
            node: attr,
            data: {
              attr: attrName,
              expected: option.value,
            },
            fix(fixer) {
              if (option.value) {
                if (attr.value) {
                  return fixer.replaceText(attr.value, option.value);
                }
                return fixer.insertTextAfter(attr.key, `="${option.value}"`);
              }
              return null;
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
