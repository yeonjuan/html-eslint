/**
 * @import {AttributeValue} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 * @typedef {Object} ClassInfo
 * @property {string} name
 * @property {import("@html-eslint/types").AnyNode['loc']} loc
 * @property {import("@html-eslint/types").AnyNode['range']} range
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  DUPLICATE_CLASS: "duplicateClass",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow to use duplicate class",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-duplicate-class"),
    },
    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_CLASS]: "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    /**
     * @param {AttributeValue} value
     * @returns {{value: string, pos: number}[]}
     */
    function splitClassAndSpaces(value) {
      /**
       * @type {{value: string, pos: number}[]}
       */
      const result = [];
      const regex = /(\s+|\S+)/g;
      /**
       * @type {RegExpExecArray | null}
       */
      let match = null;

      while ((match = regex.exec(value.value)) !== null) {
        result.push({
          value: match[0],
          pos: match.index,
        });
      }

      return result;
    }

    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class") {
          return;
        }
        const attributeValue = node.value;
        if (
          !attributeValue ||
          !attributeValue.value ||
          attributeValue.parts.some((part) => part.type === NODE_TYPES.Template)
        ) {
          return;
        }
        const classesAndSpaces = splitClassAndSpaces(attributeValue);
        const classSet = new Set();
        classesAndSpaces.forEach(({ value, pos }, index) => {
          const className = value.trim();

          if (className.length && classSet.has(className)) {
            context.report({
              loc: {
                start: {
                  line: attributeValue.loc.start.line,
                  column: attributeValue.loc.start.column + pos,
                },
                end: {
                  line: attributeValue.loc.start.line,
                  column:
                    attributeValue.loc.start.column + pos + className.length,
                },
              },
              data: {
                class: className,
              },
              messageId: MESSAGE_IDS.DUPLICATE_CLASS,
              fix(fixer) {
                if (!node.value) {
                  return null;
                }
                const before = classesAndSpaces[index - 1];
                const after = classesAndSpaces[index + 1];
                const hasSpacesBefore =
                  !!before && before.value.trim().length === 0;
                const hasSpacesAfter =
                  !!after && after.value.trim().length === 0;
                const hasClassBefore = !!classesAndSpaces[index - 2];
                const hasClassAfter = !!classesAndSpaces[index + 2];

                const startRange = hasSpacesBefore
                  ? attributeValue.range[0] + before.pos
                  : attributeValue.range[0] + pos;

                const endRange = hasSpacesAfter
                  ? attributeValue.range[0] +
                    pos +
                    value.length +
                    after.value.length
                  : attributeValue.range[0] + pos + value.length;

                return fixer.replaceTextRange(
                  [startRange, endRange],
                  hasClassBefore && hasClassAfter ? " " : ""
                );
              },
            });
          } else {
            classSet.add(className);
          }
        });
      },
    });
  },
};
