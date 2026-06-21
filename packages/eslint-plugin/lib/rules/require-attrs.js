/**
 * @import {
 *   Attribute,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {
 *   ReportFixFunction,
 *   RuleModule
 * } from "../types"
 * @typedef {Object} Condition
 * @property {string} attr
 * @property {string} [value]
 * @property {"present" | "absent" | "equal" | "not-equal"} kind
 *
 * @typedef {Object} Option
 * @property {string} tag
 * @property {string} attr
 * @property {string} [value]
 * @property {string} [message]
 * @property {Condition[]} [conditions]
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getNameOf } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

/** @type {RuleModule<Option[]>} */
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
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attr: { type: "string" },
                value: { type: "string" },
                kind: {
                  enum: ["present", "absent", "equal", "not-equal"],
                },
              },
              required: ["attr", "kind"],
              additionalProperties: false,
            },
          },
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
    /** @type {Option[]} */
    const options = context.options || [];
    /** @type {Map<string, Option[]>} */
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
     * @param {Attribute | undefined} attr
     * @returns {boolean}
     */
    function isPresent(attr) {
      return !!attr;
    }

    /**
     * @param {Attribute | undefined} attr
     * @returns {boolean}
     */
    function isAbsent(attr) {
      return !attr;
    }

    /**
     * @param {Attribute | undefined} attr
     * @param {string | undefined} value
     * @returns {boolean}
     */
    function isEqual(attr, value) {
      return !!attr && !!attr.value && attr.value.value === value;
    }

    /**
     * @param {Attribute | undefined} attr
     * @param {string | undefined} value
     * @returns {boolean}
     */
    function isNotEqual(attr, value) {
      return !attr || !attr.value || attr.value.value !== value;
    }

    /**
     * @param {Condition} condition
     * @param {Attribute[]} attributes
     * @returns {boolean}
     */
    function evaluateCondition(condition, attributes) {
      const attr = attributes.find((a) => a.key?.value === condition.attr);
      switch (condition.kind) {
        case "present":
          return isPresent(attr);
        case "absent":
          return isAbsent(attr);
        case "equal":
          return isEqual(attr, condition.value);
        case "not-equal":
          return isNotEqual(attr, condition.value);
        default:
          return false;
      }
    }

    /**
     * @param {StyleTag | ScriptTag | Tag} node
     * @param {string} tagName
     */
    function check(node, tagName) {
      const tagOptions = tagOptionsMap.get(tagName) || [];
      const attributes = node.attributes || [];

      tagOptions.forEach((option) => {
        if (option.conditions) {
          const conditionsMet = option.conditions.every((condition) =>
            evaluateCondition(condition, attributes)
          );
          if (!conditionsMet) return;

          const attrName = option.attr;
          const requireAttr = attributes.find((a) => a.key?.value === attrName);
          if (!requireAttr) {
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
                if (typeof option.value !== "string") {
                  return null;
                }
                return fixer.insertTextAfter(
                  node.openStart,
                  ` ${attrName}="${option.value}"`
                );
              },
            });
          }
        } else {
          const attrName = option.attr;
          const attr = attributes.find((attr) => attr.key?.value === attrName);
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
                if (typeof option.value !== "string") {
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
        }
      });
    }

    /** @param {StyleTag | ScriptTag} node */
    function checkStyleOrScript(node) {
      const tagName = getNameOf(node);
      if (!tagOptionsMap.has(tagName)) {
        return;
      }
      check(node, tagName);
    }

    /** @param {Tag} node */
    function checkTag(node) {
      const tagName = getNameOf(node);
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
