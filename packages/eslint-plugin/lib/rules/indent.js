/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("../types").ElementNode} ElementNode
 * @typedef {import("../types").AttrNode} AttrNode
 * @typedef {import("../types").TagNode} TagNode
 * @typedef {import("../types").AnyNode} AnyNode
 * @typedef {import("../types").BaseNode} BaseNode
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 *
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { NodeUtils } = require("./utils");

/** @type {MessageId} */
const MESSAGE_ID = {
  WRONG_INDENT: "wrongIndent",
};

/** @type {IndentType} */
const INDENT_TYPES = {
  TAB: "tab",
  SPACE: "space",
};

const IGNORING_NODES = [
  NODE_TYPES.PRE,
  NODE_TYPES.SCRIPT,
  NODE_TYPES.STYLE,
  NODE_TYPES.XMP,
];

/**
 * @type {Rule}
 */
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
     * @param {BaseNode} node
     */
    function getLineCodeBefore(node) {
      return sourceCode.text
        .slice(node.range[0] - node.loc.start.column, node.range[0])
        .replace("\n", "");
    }

    /**
     * @param {BaseNode} node
     * @param {BaseNode} [nodeToReport]
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

    /**
     * @param {AnyNode} startTag
     * @param {AttrNode[]} attrs
     */
    function checkAttrsIndent(startTag, attrs) {
      attrs.forEach((attr) => {
        if (attr.loc.start.line !== startTag.loc.start.line) {
          checkIndent(attr);
        }
      });
    }

    /**
     * @param {AnyNode} startTag
     */
    function checkEndOfStartTag(startTag) {
      const start = startTag.range[1] - 1;
      const end = startTag.range[1];
      const line = startTag.loc.end.line;
      const endCol = startTag.loc.end.column;
      const startCol = startTag.loc.end.column - 1;

      checkIndent({
        range: [start, end],
        start,
        end,
        loc: {
          start: {
            line,
            column: startCol,
          },
          end: {
            line,
            column: endCol,
          },
        },
      });
    }
    let nodesToIgnoreChildren = [];
    return {
      /**
       * @param {ElementNode} node
       */
      "*"(node) {
        if (IGNORING_NODES.includes(node.type)) {
          nodesToIgnoreChildren.push(node);
          return;
        }
        if (nodesToIgnoreChildren.length) {
          return;
        }

        indentLevel.up();

        if (node.startTag && Array.isArray(node.attrs)) {
          checkAttrsIndent(node.startTag, node.attrs);
        }

        (node.childNodes || []).forEach((current) => {
          if (current.startTag) {
            checkIndent(current.startTag);
          }
          if (current.endTag) {
            checkIndent(current.endTag);
          }
        });

        if (
          (NodeUtils.isTextNode(node) || NodeUtils.isCommentNode(node)) &&
          node.lineNodes &&
          node.lineNodes.length
        ) {
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
      "*:exit"(node) {
        if (IGNORING_NODES.includes(node.type)) {
          nodesToIgnoreChildren.pop();
          return;
        }
        if (nodesToIgnoreChildren.length) {
          return;
        }
        indentLevel.down();

        if (node.startTag) {
          checkEndOfStartTag(node.startTag);
        }
      },
    };
  },
};

function getIndentTypeAndSize(options) {
  /**
   * @type {IndentType['SPACE'] | IndentType['TAB']}
   */
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
