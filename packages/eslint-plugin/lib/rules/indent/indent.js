/**
 * @import {AnyNode, Tag, TemplateText, TemplateLiteral, OpenTemplate, CloseTemplate, ScriptTag, StyleTag} from "@html-eslint/types";
 * @import {Line, RuleListener, Context, RuleModule} from "../../types";
 * @import {AST} from "eslint";
 *
 * @typedef {AnyNode | Line} AnyNodeOrLine
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 * @typedef {Object} IndentOptionInfo
 * @property {IndentType["TAB"] | IndentType["SPACE"]} indentType
 * @property {number} indentSize
 * @property {string} indentChar
 *
 * @typedef {"tab" | number} Option1
 * @typedef {Object} Option2
 * @property {number} [Option2.Attribute]
 * @property {Record<string, number>} [Option2.tagChildrenIndent]
 */

const { parseTemplateLiteral } = require("../utils/template-literal");
const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../../constants");
const {
  splitToLineNodes,
  isLine,
  isTag,
  hasTemplate,
  isScript,
  isStyle,
} = require("../utils/node");
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
 * @type {RuleModule<[Option1, Option2]>}
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
          tagChildrenIndent: {
            default: {},
            type: "object",
            patternProperties: {
              "^[a-z]+$": {
                type: "integer",
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
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
    const { indentType, indentSize, indentChar } = getIndentOptionInfo(context);

    /**
     * @param {Tag | ScriptTag | StyleTag} node
     * @return {number}
     */
    function getTagIncreasingLevel(node) {
      if (
        node.parent &&
        isTag(node.parent) &&
        indentLevelOptions &&
        typeof indentLevelOptions.tagChildrenIndent === "object" &&
        indentLevelOptions.tagChildrenIndent
      ) {
        const option =
          indentLevelOptions.tagChildrenIndent[node.parent.name.toLowerCase()];
        if (typeof option === "number") {
          return option;
        }
      }

      return 1;
    }

    /**
     * @param {AnyNode} node
     * @return {number}
     */
    function getIncreasingLevel(node) {
      if (isLine(node)) {
        return 1;
      }
      if (isTag(node) || isScript(node) || isStyle(node)) {
        return getTagIncreasingLevel(node);
      }
      const type = node.type;
      if (type === NODE_TYPES.Attribute) {
        const optionIndent = indentLevelOptions[type];
        if (typeof optionIndent === "number") {
          return optionIndent;
        }
      }
      return 1;
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
        getIncreasingLevel,
      });
      indentLevel.setBase(baseLevel);

      let parentIgnoringChildCount = 0;

      /**
       * @param {AnyNode | Line | TemplateText | OpenTemplate | CloseTemplate} node
       * @returns {string}
       */
      function getActualIndent(node) {
        const lines = sourceCode.getLines();
        const line = lines[node.loc.start.line - 1];
        let column = node.loc.start.column;

        if (isLine(node)) {
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
       * @param {AnyNode | Line | TemplateText | OpenTemplate | CloseTemplate} node
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
            loc: targetNode.loc,
            messageId: MESSAGE_ID.WRONG_INDENT,
            data: getMessageData(actualIndent, indentLevel.value()),
            fix(fixer) {
              return fixer.replaceTextRange(targetNode.range, expectedIndent);
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
        CloseScriptTag: checkIndent,
        StyleTag(node) {
          indentLevel.indent(node);
        },
        "StyleTag:exit"(node) {
          indentLevel.dedent(node);
        },
        OpenStyleTagStart: checkIndent,
        OpenStyleTagEnd: checkIndent,
        CloseStyleTag: checkIndent,
        OpenTagStart: checkIndent,
        OpenTagEnd(node) {
          checkIndent(node);
        },
        CloseTag: checkIndent,
        "Tag:exit"(node) {
          if (IGNORING_NODES.includes(node.name)) {
            parentIgnoringChildCount--;
          }
          indentLevel.dedent(node);
        },

        Attribute(node) {
          indentLevel.indent(node);
        },
        AttributeKey: checkIndent,
        AttributeValue: checkIndent,
        "Attribute:exit"(node) {
          indentLevel.dedent(node);
        },
        Text(node) {
          indentLevel.indent(node);
          if (hasTemplate(node)) {
            node.parts.forEach((part) => {
              if (part.type !== NODE_TYPES.Part) {
                if (part.open) {
                  checkIndent(part.open);
                }
                if (part.close) {
                  checkIndent(part.close);
                }
              }
            });
          }

          const lineNodes = splitToLineNodes(node);

          lineNodes.forEach((lineNode) => {
            if (lineNode.hasTemplate) {
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
          if (hasTemplate(node)) {
            node.parts.forEach((part) => {
              if (part.type !== NODE_TYPES.Part) {
                if (part.open) {
                  checkIndent(part.open);
                }
                if (part.close) {
                  checkIndent(part.close);
                }
              }
            });
          }

          const lineNodes = splitToLineNodes(node);
          lineNodes.forEach((lineNode) => {
            if (lineNode.hasTemplate) {
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
          parseTemplateLiteral(
            node.quasi,
            getSourceCode(context),
            createIndentVisitor(base)
          );
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          const base = getTemplateLiteralBaseIndentLevel(node);
          parseTemplateLiteral(
            node,
            getSourceCode(context),
            createIndentVisitor(base)
          );
        }
      },
    };
  },
};

/**
 * @param {AnyNodeOrLine | TemplateText | OpenTemplate | CloseTemplate} node
 * @param {string} actualIndent
 * @return {{range: AST.Range; loc: AST.SourceLocation}}
 */
function getIndentNodeToReport(node, actualIndent) {
  let rangeStart = node.range[0];

  if (!isLine(node)) {
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
 * @param {string} str
 * @returns {number}
 */
function countLeftPadding(str) {
  return str.length - str.replace(/^[\s\t]+/, "").length;
}

/**
 * @param {Context<any[]>} context
 * @return {IndentOptionInfo}
 */
function getIndentOptionInfo(context) {
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
}
