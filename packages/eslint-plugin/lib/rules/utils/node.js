/**
 * @import {Attribute, Tag, ScriptTag, StyleTag, AnyNode, Text, CommentContent, Comment, AttributeValue, AttributeKey, AnyToken} from "@html-eslint/types";
 * @import {Line, BaseNode} from "../../types";
 * @import {AST} from "eslint";
 */

const { NODE_TYPES } = require("@html-eslint/parser");

/**
 * @param {Tag | ScriptTag | StyleTag} node
 * @param {string} key
 * @returns {Attribute | undefined}
 */
function findAttr(node, key) {
  return node.attributes.find(
    (attr) => attr.key && attr.key.value.toLowerCase() === key.toLowerCase()
  );
}

/**
 * @param {Tag | ScriptTag} node
 * @param {string} attrName
 * @returns {boolean}
 */
function hasAttr(node, attrName) {
  return node.attributes.some(
    (a) => a.type === "Attribute" && a.key.value === attrName
  );
}

/**
 * Checks whether a node's attributes is empty or not.
 * @param {Tag | ScriptTag | StyleTag} node
 * @returns {boolean}
 */
function isAttributesEmpty(node) {
  return !node.attributes || node.attributes.length <= 0;
}

/**
 * Checks whether a node's all tokens are on the same line or not.
 * @param {AnyNode} node A node to check
 * @returns {boolean} `true` if a node's tokens are on the same line, otherwise `false`.
 */
function isNodeTokensOnSameLine(node) {
  return node.loc.start.line === node.loc.end.line;
}

/**
 *
 * @param {AST.Range} rangeA
 * @param {AST.Range} rangeB
 * @returns {boolean}
 */
function isRangesOverlap(rangeA, rangeB) {
  return rangeA[0] < rangeB[1] && rangeB[0] < rangeA[1];
}

/**
 * @param {(Text | CommentContent)['parts']} parts
 * @param {AST.Range} range
 * @returns {boolean}
 */
function isOverlapWithTemplates(parts, range) {
  return parts
    .filter((part) => part.type !== NODE_TYPES.Part)
    .some((part) => isRangesOverlap(part.range, range));
}

/**
 * @param {AttributeKey | AttributeValue | Text | CommentContent} node
 * @returns {boolean}
 */
function hasTemplate(node) {
  return node.parts.some((part) => part.type !== NODE_TYPES.Part);
}

/**
 *
 * @param {Text | CommentContent} node
 * @returns {Line[]}
 */
function splitToLineNodes(node) {
  let start = node.range[0];
  let line = node.loc.start.line;
  const startCol = node.loc.start.column;
  /**
   * @type {Line[]}
   */
  const lineNodes = [];
  const parts = node.parts || [];
  /**
   *
   * @param {AST.Range} range
   */
  function hasTemplate(range) {
    return parts.some(
      (part) =>
        part.type !== NODE_TYPES.Part && isRangesOverlap(part.range, range)
    );
  }

  node.value.split("\n").forEach((value, index) => {
    const columnStart = index === 0 ? startCol : 0;
    /**
     * @type {AST.Range}
     */
    const range = [start, start + value.length];
    const loc = {
      start: {
        line,
        column: columnStart,
      },
      end: {
        line,
        column: columnStart + value.length,
      },
    };
    /**
     * @type {Line}
     */
    const lineNode = {
      type: "Line",
      value,
      range,
      loc,
      hasTemplate: hasTemplate(range),
    };

    start += value.length + 1;
    line += 1;

    lineNodes.push(lineNode);
  });

  return lineNodes;
}

/**
 * Get location between two nodes.
 * @param {{loc: AST.SourceLocation}} before A node placed in before
 * @param {{loc: AST.SourceLocation}} after A node placed in after
 * @returns {AST.SourceLocation} location between two nodes.
 */
function getLocBetween(before, after) {
  return {
    start: before.loc.end,
    end: after.loc.start,
  };
}

/**
 * @param {BaseNode} node
 * @returns {node is Tag}
 */
function isTag(node) {
  return node.type === NODE_TYPES.Tag;
}

/**
 * @param {BaseNode} node
 * @returns {node is ScriptTag}
 */
function isScript(node) {
  return node.type === NODE_TYPES.ScriptTag;
}

/**
 * @param {BaseNode} node
 * @returns {node is StyleTag}
 */
function isStyle(node) {
  return node.type === NODE_TYPES.StyleTag;
}

/**
 * @param {BaseNode} node
 * @returns {node is Comment}
 */
function isComment(node) {
  return node.type === NODE_TYPES.Comment;
}

/**
 * @param {BaseNode} node
 * @returns {node is Text}
 */
function isText(node) {
  return node.type === NODE_TYPES.Text;
}

/**
 * @param {BaseNode} node
 * @returns {node is Line}
 */
function isLine(node) {
  return node.type === "Line";
}

const lineBreakPattern = /\r\n|[\r\n\u2028\u2029]/u;
const lineEndingPattern = new RegExp(lineBreakPattern.source, "gu");
/**
 * @param {string} source
 * @returns {string[]}
 */
function codeToLines(source) {
  return source.split(lineEndingPattern);
}

/**
 * @param {AnyNode} node
 * @param {(node: AnyNode) => boolean} predicate
 * @returns {null | AnyNode}
 */
function findParent(node, predicate) {
  if (!node.parent) {
    return null;
  }
  if (
    node.type === "TaggedTemplateExpression" ||
    node.type === "TemplateLiteral" ||
    node.type === "TemplateElement"
  ) {
    return null;
  }
  if (predicate(node.parent)) {
    return node.parent;
  }
  return findParent(node.parent, predicate);
}

/**
 *
 * @param {AnyToken[]} tokens
 * @returns {((CommentContent | Text)['parts'][number])[]}
 */
function getTemplateTokens(tokens) {
  return (
    []
      .concat(
        ...tokens
          // @ts-ignore
          .map((token) => token["parts"] || [])
      )
      // @ts-ignore
      .filter((token) => token.type !== NODE_TYPES.Part)
  );
}

module.exports = {
  findAttr,
  isAttributesEmpty,
  isNodeTokensOnSameLine,
  splitToLineNodes,
  getLocBetween,
  findParent,
  isTag,
  isComment,
  isText,
  isLine,
  isScript,
  isStyle,
  isOverlapWithTemplates,
  codeToLines,
  isRangesOverlap,
  getTemplateTokens,
  hasTemplate,
  hasAttr,
};
