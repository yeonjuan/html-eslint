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

    function getQuotes(attr) {
      return [attr.startWrapper.value, attr.endWrapper.value];
    }

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
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
        node.attributes.forEach(checkQuotes);
      },
    };
  },
};
