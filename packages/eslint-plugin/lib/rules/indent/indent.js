/**
 * @typedef { import("../../types").RuleModule } RuleModule
 * @typedef { import("../../types").AnyNode } AnyNode
 * @typedef { import("../../types").Line } Line
 * @typedef { import("../../types").RuleListener } RuleListener
 * @typedef { import("eslint").AST.Token } Token
 * @typedef { import("eslint").SourceCode } SourceCode
 * @typedef { import("eslint").AST.Range } Range
 * @typedef { import("eslint").AST.SourceLocation } SourceLocation
 * @typedef { import("../../types").TemplateLiteral } TemplateLiteral
 *
 *
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 */

const { parse } = require("@html-eslint/template-parser");
const { RULE_CATEGORY } = require("../../constants");
const { splitToLineNodes } = require("../utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("../utils/settings");
const { getSourceCode } = require("../utils/source-code");
const IndentLevel = require("./indent-level");

/** @type {MessageId} */
const MESSAGE_ID = {
  WRONG_INDENT: "wrongIndent",
};

/** @type {IndentType} */
const INDENT_TYPES = {
  TAB: "tab",
  SPACE: "space",
};

const IGNORING_NODES = ["pre", "xmp"];

/**
 * @type {RuleModule}
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
      {
        type: "object",
        properties: {
          Attribute: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
        },
      },
    ],
    messages: {
      [MESSAGE_ID.WRONG_INDENT]:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    const indentLevelOptions = (context.options && context.options[1]) || {};
    const lines = sourceCode.getLines();
    const { indentType, indentSize, indentChar } = (function () {
      const options = context.options;
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
      const indentChar =
        indentType === INDENT_TYPES.SPACE ? " ".repeat(indentSize) : "\t";
      return { indentType, indentSize, indentChar };
    })();

    /**
     * @param {string} str
     * @returns {number}
     */
    function countLeftPadding(str) {
      return str.length - str.replace(/^[\s\t]+/, "").length;
    }

    /**
     * @param {AnyNode} node
     * @returns {node is Line}
     */
    function isLineNode(node) {
      return node.type === "Line";
    }

    /**
     *
     * @param {TemplateLiteral} node
     * @returns {number}
     */
    function getTemplateLiteralBaseIndentLevel(node) {
      // @ts-ignore
      const lineIndex = node.loc.start.line - 1;
      const line = lines[lineIndex];

      const spaceCount = countLeftPadding(line);
      if (indentType === "space") {
        return Math.floor(spaceCount / indentSize) + 1;
      } else {
        return spaceCount + 1;
      }
    }

    /**
     * @param {number} baseLevel
     */
    function createIndentVisitor(baseLevel) {
      const indentLevel = new IndentLevel({
        getIncreasingLevel(node) {
          return typeof indentLevelOptions[node.type] === "number"
            ? indentLevelOptions[node.type]
            : 1;
        },
      });
      indentLevel.setBase(baseLevel);

      let parentIgnoringChildCount = 0;

      /**
       * @param {AnyNode} node
       * @returns {string}
       */
      function getActualIndent(node) {
        const lines = sourceCode.getLines();
        const line = lines[node.loc.start.line - 1];
        let column = node.loc.start.column;

        if (isLineNode(node)) {
          column += countLeftPadding(node.value);
        }

        return line.slice(0, column);
      }

      /**
       * @returns {string}
       */
      function getExpectedIndent() {
        return indentChar.repeat(indentLevel.value());
      }

      /**
       * @param {AnyNode} node
       * @param {string} actualIndent
       * @return {{ range: Range, loc: SourceLocation }}
       */
      function getIndentNodeToReport(node, actualIndent) {
        let rangeStart = node.range[0];

        if (node.type !== "Line") {
          rangeStart -= actualIndent.length;
        }

        return {
          range: [rangeStart, rangeStart + actualIndent.length],
          loc: {
            start: {
              column: 0,
              line: node.loc.start.line,
            },
            end: {
              column: actualIndent.length,
              line: node.loc.start.line,
            },
          },
        };
      }

      /**
       * @param {string} actualIndent
       * @param {number} expectedIndentSize
       */
      function getMessageData(actualIndent, expectedIndentSize) {
        const actualTabs = (actualIndent.match(/\t/g) || []).length;
        const actualSpaces = (actualIndent.match(/[^\S\t\n\r]/g) || []).length;
        let actual = "";
        if (!actualTabs && !actualSpaces) {
          actual = "no indent";
        } else {
          if (actualTabs) {
            actual += `${actualTabs} tab`;
          }
          if (actualSpaces) {
            if (actual) {
              actual += ", ";
            }
            actual += `${actualSpaces} space`;
          }
        }

        if (indentType === "space") {
          expectedIndentSize *= indentSize;
        }

        return {
          actual,
          expected: `${expectedIndentSize} ${indentType}`,
        };
      }

      /**
       * @param {AnyNode} node
       */
      function checkIndent(node) {
        if (parentIgnoringChildCount > 0) {
          return;
        }
        const actualIndent = getActualIndent(node);
        const expectedIndent = getExpectedIndent();

        if (actualIndent.trim().length) {
          return;
        }
        if (actualIndent !== expectedIndent) {
          const targetNode = getIndentNodeToReport(node, actualIndent);
          context.report({
            node: targetNode,
            messageId: MESSAGE_ID.WRONG_INDENT,
            data: getMessageData(actualIndent, indentLevel.value()),
            fix(fixer) {
              return fixer.replaceText(targetNode, expectedIndent);
            },
          });
        }
      }

      /**
       * @type {RuleListener}
       */
      const visitor = {
        Tag(node) {
          if (IGNORING_NODES.includes(node.name)) {
            parentIgnoringChildCount++;
          }
          indentLevel.indent(node);
        },
        ScriptTag(node) {
          indentLevel.indent(node);
        },
        "ScriptTag:exit"(node) {
          indentLevel.dedent(node);
        },
        OpenScriptTagStart: checkIndent,
        OpenScriptTagEnd: checkIndent,
        StyleTag(node) {
          indentLevel.indent(node);
        },
        "StyleTag:exit"(node) {
          indentLevel.dedent(node);
        },
        OpenStyleTagStart: checkIndent,
        OpenStyleTagEnd: checkIndent,
        OpenTagStart: checkIndent,
        OpenTagEnd: checkIndent,
        CloseTag: checkIndent,
        "Tag:exit"(node) {
          if (IGNORING_NODES.includes(node.name)) {
            parentIgnoringChildCount--;
          }
          indentLevel.dedent(node);
        },

        // Attribute
        Attribute(node) {
          indentLevel.indent(node);
        },
        AttributeKey: checkIndent,
        AttributeValue: checkIndent,
        "Attribute:exit"(node) {
          indentLevel.dedent(node);
        },

        // Text
        Text(node) {
          indentLevel.indent(node);
          const lineNodes = splitToLineNodes(node);

          lineNodes.forEach((lineNode) => {
            if (lineNode.skipIndentCheck) {
              return;
            }
            if (lineNode.value.trim().length) {
              checkIndent(lineNode);
            }
          });
        },
        "Text:exit"(node) {
          indentLevel.dedent(node);
        },
        Comment(node) {
          indentLevel.indent(node);
        },
        CommentOpen: checkIndent,
        CommentContent(node) {
          indentLevel.indent(node);
          const lineNodes = splitToLineNodes(node);
          lineNodes.forEach((lineNode) => {
            if (lineNode.skipIndentCheck) {
              return;
            }
            if (lineNode.value.trim().length) {
              checkIndent(lineNode);
            }
          });
        },
        CommentClose: checkIndent,
        "Comment:exit"(node) {
          indentLevel.dedent(node);
        },
        "CommentContent:exit"(node) {
          indentLevel.dedent(node);
        },
      };
      return visitor;
    }

    return {
      ...createIndentVisitor(0),
      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          const base = getTemplateLiteralBaseIndentLevel(node.quasi);
          parse(node.quasi, getSourceCode(context), createIndentVisitor(base));
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          const base = getTemplateLiteralBaseIndentLevel(node);
          parse(node, getSourceCode(context), createIndentVisitor(base));
        }
      },
    };
  },
};
