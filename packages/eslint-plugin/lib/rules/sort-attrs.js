/**
 * @import {Attribute} from "@html-eslint/types";
 * @import {RuleFixer, RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {string[]} [Option.priority]
 */

const { hasTemplate } = require("./utils/node");
const { RULE_CATEGORY } = require("../constants");
const { getSourceCode } = require("./utils/source-code");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNSORTED: "unsorted",
};

/**
 * @type {RuleModule<[Option]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce attributes alphabetical sorting",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
      url: getRuleUrl("sort-attrs"),
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          priority: {
            type: "array",
            items: {
              type: "string",
              uniqueItems: true,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.UNSORTED]: "Attributes should be sorted alphabetically",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    const option = context.options[0] || {
      priority: ["id", "type", "class", "style"],
    };
    /**
     * @type {string[]}
     */
    const priority = option.priority || [];

    /**
     * @param {Attribute} attrA
     * @param {Attribute} attrB
     * @return {number}
     */
    function compare(attrA, attrB) {
      const keyA = attrA.key.value;
      const keyB = attrB.key.value;

      const keyAReservedValue = priority.indexOf(keyA);
      const keyBReservedValue = priority.indexOf(keyB);
      if (keyAReservedValue >= 0 && keyBReservedValue >= 0) {
        return keyAReservedValue - keyBReservedValue;
      } else if (keyAReservedValue >= 0) {
        return -1;
      } else if (keyBReservedValue >= 0) {
        return 1;
      }
      return keyA.localeCompare(keyB);
    }

    /**
     * @param {string} source
     * @param {Attribute[]} unsorted
     * @param {Attribute[]} sorted
     * @returns {string}
     */
    function getSortedCode(source, unsorted, sorted) {
      let result = "";
      unsorted.forEach((unsortedAttr, index) => {
        const sortedAttr = sorted[index];
        result += source.slice(sortedAttr.range[0], sortedAttr.range[1]);

        const nextUnsortedAttr = unsorted[index + 1];
        if (nextUnsortedAttr) {
          result += source.slice(
            unsortedAttr.range[1],
            nextUnsortedAttr.range[0]
          );
        }
      });
      return result;
    }

    /**
     * @param {RuleFixer} fixer
     * @param {Attribute[]} unsorted
     * @param {Attribute[]} sorted
     */
    function fix(fixer, unsorted, sorted) {
      const source = sourceCode.getText();
      return fixer.replaceTextRange(
        [unsorted[0].range[0], unsorted[unsorted.length - 1].range[1]],
        getSortedCode(source, unsorted, sorted)
      );
    }

    /**
     * @param {Attribute[]} before
     * @param {Attribute[]} after
     * @returns {boolean}
     */
    function isChanged(before, after) {
      for (let i = 0; i < before.length; i++) {
        if (before[i] !== after[i]) return true;
      }
      return false;
    }

    /**
     * @param {Attribute[]} attributes
     * @return {Attribute[][]}
     */
    function groupAttributes(attributes) {
      /**
       * @type {Attribute[][]}
       */
      const attributesList = [];
      let index = 0;

      for (const attribute of attributes) {
        if (hasTemplate(attribute.key)) {
          index = attributesList.length;
          continue;
        }
        if (!attributesList[index]) {
          attributesList[index] = [];
        }
        attributesList[index].push(attribute);
      }
      return attributesList;
    }

    /**
     * @param {Attribute[]} unsorted
     */
    function checkSorting(unsorted) {
      if (unsorted.length <= 1) {
        return;
      }
      const grouped = groupAttributes(unsorted);
      grouped.forEach((unsorted) => {
        const sorted = [...unsorted].sort(compare);

        if (!isChanged(unsorted, sorted)) {
          return;
        }
        const first = unsorted[0];
        const last = unsorted[unsorted.length - 1];
        context.report({
          loc: {
            start: first.loc.start,
            end: last.loc.end,
          },
          messageId: MESSAGE_IDS.UNSORTED,
          fix(fixer) {
            return fix(fixer, unsorted, sorted);
          },
        });
      });
    }

    return createVisitors(context, {
      ScriptTag(node) {
        checkSorting(node.attributes);
      },
      Tag(node) {
        checkSorting(node.attributes);
      },
      StyleTag(node) {
        checkSorting(node.attributes);
      },
    });
  },
};
