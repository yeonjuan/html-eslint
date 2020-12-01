/**
 * @typedef {import("../types").HTMLNode} HTMLNode
 *
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 *
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");

/** @type {MessageId} */
const MESSAGE_ID = {
  WRONG_INDENT: "wrongIndent",
};

/** @type {IndentType} */
const INDENT_TYPES = {
  TAB: "tab",
  SPACE: "space",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent indentation",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [
      {
        oneOf: [
          {
            enum: ["tab"],
          },
          {
            type: "integer",
            minimum: 0,
          },
        ],
      },
    ],
    messages: {
      [MESSAGE_ID.WRONG_INDENT]:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const indentLevel = new IndentLevel();
    const { indentType, indentSize } = getIndentTypeAndSize(context.options);
    const indentUnit =
      indentType === INDENT_TYPES.SPACE ? " ".repeat(indentSize) : "\t";

    /**
     * @param {HTMLNode} node
     */
    function getLineCodeBefore(node) {
      return sourceCode.text
        .slice(node.range[0] - node.loc.start.column, node.range[0])
        .replace("\n", "");
    }

    /**
     * @param {HTMLNode} node
     * @param {HTMLNode} [nodeToReport]
     */
    function checkIndent(node, nodeToReport) {
      const codeBefore = getLineCodeBefore(node);
      if (codeBefore.trim().length === 0) {
        const level = indentLevel.get();
        const expectedIndent = indentUnit.repeat(level);
        if (codeBefore !== expectedIndent) {
          const expected = `${
            indentType === INDENT_TYPES.SPACE ? level * indentSize : level
          } ${indentType}`;
          const actualTabs = (codeBefore.match(/\t/g) || []).length;
          const actualSpaces = (codeBefore.match(/[^\S\t\n\r]/g) || []).length;

          let actual = "";

          if (!actualTabs && !actualSpaces) {
            actual = "no indent";
          }
          if (actualTabs) {
            actual += `${actualTabs} ${INDENT_TYPES.TAB}`;
          }
          if (actualSpaces) {
            actual += `${actual.length ? ", " : ""}${actualSpaces} ${
              INDENT_TYPES.SPACE
            }`;
          }

          context.report({
            node: nodeToReport || node,
            messageId: MESSAGE_ID.WRONG_INDENT,
            data: {
              expected,
              actual,
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [node.range[0] - (node.loc.start.column - 1), node.range[0]],
                expectedIndent
              );
            },
          });
        }
      }
    }
    let ignoreChildren = false;
    return {
      /**
       * @param {HTMLNode} node
       */
      "*"(node) {
        if (
          node.type === NODE_TYPES.PRE ||
          node.type === NODE_TYPES.SCRIPT ||
          ignoreChildren
        ) {
          ignoreChildren = true;
          return;
        }

        indentLevel.up();

        (node.childNodes || []).forEach((current) => {
          if (current.startTag) {
            checkIndent(current.startTag);
          }
          if (current.endTag) {
            checkIndent(current.endTag);
          }
        });

        if (node.lineNodes && node.lineNodes.length) {
          if (!node.startTag) {
            indentLevel.down();
          }
          node.lineNodes.forEach((lineNode) => {
            if (lineNode.textLine.trim().length) {
              checkIndent(lineNode, node);
            }
          });
          if (!node.startTag) {
            indentLevel.up();
          }
        }
      },
      "Pre:exit"() {
        ignoreChildren = false;
      },
      "Script:exit"() {
        ignoreChildren = false;
      },
      "*:exit"() {
        indentLevel.down();
      },
    };
  },
};

function getIndentTypeAndSize(options) {
  let indentType = INDENT_TYPES.SPACE;
  let indentSize = 4;
  if (options.length) {
    if (options[0] === INDENT_TYPES.TAB) {
      indentType = INDENT_TYPES.TAB;
    } else {
      indentSize = options[0];
    }
  }
  return { indentType, indentSize };
}

class IndentLevel {
  constructor() {
    this.level = -1;
  }

  up() {
    this.level++;
  }

  down() {
    this.level--;
  }

  get() {
    return this.level;
  }
}
