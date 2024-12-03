/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").AnyNode } AnyNode
 * @typedef { import("../types").LineNode } LineNode
 * @typedef { import("../types").BaseNode } BaseNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").RuleListener } RuleListener
 * @typedef { import("eslint").AST.Token } Token
 * @typedef { import("eslint").SourceCode } SourceCode
 * @typedef { import("estree").TemplateLiteral } TemplateLiteral
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 */

const { parse } = require("@html-eslint/template-parser");
const { RULE_CATEGORY } = require("../constants");
const { splitToLineNodes } = require("./utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");

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
    ],
    messages: {
      [MESSAGE_ID.WRONG_INDENT]:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);

    let baseIndentLevel = 0;
    let indentLevel = -1;
    let parentIgnoringChildCount = 0;

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

    function indent() {
      indentLevel++;
    }
    function unindent() {
      indentLevel--;
    }
    function getIndentLevel() {
      return indentLevel + baseIndentLevel;
    }

    /**
     * @param {string} str
     * @returns {number}
     */
    function countLeftPadding(str) {
      return str.length - str.replace(/^[\s\t]+/, "").length;
    }

    /**
     * @param {AnyNode} node
     * @returns {node is LineNode}
     */
    function isLineNode(node) {
      return node.type === "Line";
    }

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
      return indentChar.repeat(getIndentLevel());
    }

    /**
     * @param {AnyNode} node
     * @param {string} actualIndent
     * @return {BaseNode}
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
          data: getMessageData(actualIndent, getIndentLevel()),
          fix(fixer) {
            return fixer.replaceText(targetNode, expectedIndent);
          },
        });
      }
    }

    /**
     *
     * @param {Token} token
     */
    function getBaseIndentToken(token) {
      /**
       * @type {Token | null}
       */
      let currentToken = token;
      let tokenBefore = token;

      while (
        // @ts-ignore
        (tokenBefore = sourceCode.getTokenBefore(currentToken, {
          includeComments: true,
        }))
      ) {
        if (!tokenBefore) {
          return currentToken;
        }
        if (tokenBefore.loc.start.line !== currentToken.loc.start.line) {
          return currentToken;
        }
        currentToken = tokenBefore;
      }
      return tokenBefore;
    }

    /**
     *
     * @param {TemplateLiteral} node
     * @returns {number}
     */
    function getBaseIndentLevel(node) {
      const firstToken = sourceCode.getFirstToken(node);
      if (!firstToken) return 0;
      const baseToken = getBaseIndentToken(firstToken);
      if (!baseToken) {
        return 0;
      }
      const spaceCount = baseToken.loc.start.column;

      if (indentType === "space") {
        return Math.floor(spaceCount / indentSize);
      } else {
        return spaceCount;
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
        indent();
      },
      ScriptTag: indent,
      "ScriptTag:exit": unindent,
      OpenScriptTagStart: checkIndent,
      OpenScriptTagEnd: checkIndent,
      StyleTag: indent,
      "StyleTag:exit": unindent,
      OpenStyleTagStart: checkIndent,
      OpenStyleTagEnd: checkIndent,
      OpenTagStart: checkIndent,
      OpenTagEnd: checkIndent,
      CloseTag: checkIndent,
      /**
       * @param {TagNode} node
       */
      "Tag:exit"(node) {
        if (IGNORING_NODES.includes(node.name)) {
          parentIgnoringChildCount--;
        }
        unindent();
      },

      // Attribute
      Attribute: indent,
      AttributeKey: checkIndent,
      AttributeValue: checkIndent,
      "Attribute:exit": unindent,

      // Text
      Text(node) {
        indent();
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
      "Text:exit": unindent,

      // Comment
      Comment: indent,
      CommentOpen: checkIndent,
      CommentContent(node) {
        indent();
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
      "Comment:exit": unindent,
      "CommentContent:exit": unindent,
    };

    return {
      ...visitor,
      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          baseIndentLevel = getBaseIndentLevel(node.quasi) + 1;
          parse(node.quasi, getSourceCode(context), visitor);
        }
      },
      "TaggedTemplateExpression:exit"(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          baseIndentLevel = 0;
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          baseIndentLevel = getBaseIndentLevel(node) + 1;
          parse(node, getSourceCode(context), visitor);
        }
      },
      "TemplateLiteral:exit"(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          baseIndentLevel = 0;
        }
      },
    };
  },
};
