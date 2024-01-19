/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").AttributeNode } AttributeNode
 * @typedef { import("../types").TextNode } TextNode
 * @typedef { import("../types").RuleFixer } RuleFixer
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  UNSORTED: "unsorted",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce attributes alphabetical sorting",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
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
      },
    ],
    messages: {
      [MESSAGE_IDS.UNSORTED]: "Attributes should be sorted alphabetically",
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const option = context.options[0] || {
      priority: ["id", "type", "class", "style"],
    };
    /**
     * @type {string[]}
     */
    const priority = option.priority;

    /**
     * @param {AttributeNode} attrA
     * @param {AttributeNode} attrB
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
     * @param {AttributeNode[]} unsorted
     * @param {AttributeNode[]} sorted
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
     * @param {AttributeNode[]} unsorted
     * @param {AttributeNode[]} sorted
     */
    function fix(fixer, unsorted, sorted) {
      const source = sourceCode.getText();
      return fixer.replaceTextRange(
        [unsorted[0].range[0], unsorted[unsorted.length - 1].range[1]],
        getSortedCode(source, unsorted, sorted)
      );
    }

    /**
     * @param {AttributeNode[]} before
     * @param {AttributeNode[]} after
     * @returns {boolean}
     */
    function isChanged(before, after) {
      for (let i = 0; i < before.length; i++) {
        if (before[i] !== after[i]) return true;
      }
      return false;
    }

    /**
     * @param {AttributeNode[]} unsorted
     */
    function checkSorting(unsorted) {
      if (unsorted.length <= 1) {
        return;
      }

      const sorted = [...unsorted].sort(compare);

      if (!isChanged(unsorted, sorted)) {
        return;
      }
      const first = unsorted[0];
      const last = unsorted[unsorted.length - 1];
      context.report({
        node: {
          range: [first.range[0], last.range[1]],
          loc: {
            start: first.loc.start,
            end: last.loc.end,
          },
        },
        messageId: MESSAGE_IDS.UNSORTED,
        fix(fixer) {
          return fix(fixer, unsorted, sorted);
        },
      });
    }

    return {
      ScriptTag(node) {
        checkSorting(node.attributes);
      },
      Tag(node) {
        checkSorting(node.attributes);
      },
      StyleTag(node) {
        checkSorting(node.attributes);
      },
    };
  },
};
