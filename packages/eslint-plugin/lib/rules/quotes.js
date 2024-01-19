/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").Range } Range
 * @typedef { import("../types").AttributeNode } AttributeNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
  MISSING: "missing",
};

const QUOTES_STYLES = {
  SINGLE: "single",
  DOUBLE: "double",
};

const QUOTES_CODES = [`"`, `'`];

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforce consistent quoting attributes with double(\") or single(')",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },
    fixable: true,
    schema: [
      {
        enum: [QUOTES_STYLES.SINGLE, QUOTES_STYLES.DOUBLE],
      },
    ],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "Expected {{expected}} quotes but found {{actual}}.",
      [MESSAGE_IDS.MISSING]:
        "Expected {{expected}} quotes but no quotes found.",
    },
  },

  create(context) {
    const SELECTED_STYLE =
      context.options && context.options.length
        ? context.options[0]
        : QUOTES_STYLES.DOUBLE;
    const expectedQuote = SELECTED_STYLE === QUOTES_STYLES.DOUBLE ? `"` : `'`;

    const sourceCode = context.getSourceCode();

    /**
     * @param {Range} range
     * @returns {string}
     */
    function getCodeIn(range) {
      return sourceCode.text.slice(range[0], range[1]);
    }

    /**
     *
     * @param {AttributeNode} attr
     * @returns {[string, string]}
     */
    function getQuotes(attr) {
      // @ts-ignore
      return [attr.startWrapper.value, attr.endWrapper.value];
    }

    /**
     * @param {AttributeNode} attr
     * @returns {void}
     */
    function checkQuotes(attr) {
      if (!attr.value || attr.value.value.includes(expectedQuote)) {
        return;
      }

      if (attr.startWrapper && attr.endWrapper) {
        const [opening, closing] = getQuotes(attr);
        if (QUOTES_CODES.includes(opening)) {
          if (opening === closing && opening !== expectedQuote) {
            context.report({
              node: attr,
              messageId: MESSAGE_IDS.UNEXPECTED,
              data: {
                expected: `${SELECTED_STYLE}(${expectedQuote})`,
                actual:
                  SELECTED_STYLE === QUOTES_STYLES.SINGLE
                    ? `${QUOTES_STYLES.DOUBLE}(")`
                    : `${QUOTES_STYLES.SINGLE}(')`,
              },
              fix(fixer) {
                if (
                  !attr.startWrapper ||
                  !attr.endWrapper ||
                  attr.value === undefined
                )
                  return null;
                return fixer.replaceTextRange(
                  [attr.startWrapper.range[0], attr.endWrapper.range[1]],
                  `${expectedQuote}${attr.value.value}${expectedQuote}`
                );
              },
            });
          }
        }
      } else {
        context.report({
          node: attr,
          messageId: MESSAGE_IDS.MISSING,
          data: {
            expected: `${SELECTED_STYLE}(${expectedQuote})`,
          },
          fix(fixer) {
            if (attr.value === undefined) return null;
            const originCode = getCodeIn(attr.value.range);
            return fixer.replaceTextRange(
              attr.value.range,
              `${expectedQuote}${originCode}${expectedQuote}`
            );
          },
        });
      }
    }

    return {
      /**
       * @param {TagNode | ScriptTagNode | StyleTagNode} node
       */
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
        node.attributes.forEach((attr) => checkQuotes(attr));
      },
    };
  },
};
