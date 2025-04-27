/**
 * @typedef { import("@html-eslint/types").AnyHTMLNode} AnyHTMLNode
 */

const {
  isWhitespacesText,
  isComment,
  isTag,
  isText,
  isScript,
  isStyle,
} = require("../utils/node");

/**
 * @param {AnyHTMLNode} child
 */
function shouldIgnoreChild(child) {
  return isWhitespacesText(child) || isComment(child);
}

/**
 * @param {AnyHTMLNode} node
 * @returns {string}
 */
function getNodeName(node) {
  if (isTag(node)) {
    return node.name;
  }
  if (isText(node)) {
    return "#text";
  }
  if (isScript(node)) {
    return "script";
  }
  if (isStyle(node)) {
    return "style";
  }
  if (isComment(node)) {
    return "#comment";
  }
  return "Unknown";
}

/**
 * @param {AnyHTMLNode} node
 * @returns {string}
 */
function getDisplayNodeName(node) {
  if (isTag(node)) {
    return node.name;
  }
  if (isText(node)) {
    return "Text";
  }
  if (isScript(node)) {
    return "script";
  }
  if (isStyle(node)) {
    return "style";
  }
  if (isComment(node)) {
    return "Comment";
  }
  return "#unknown";
}

module.exports = {
  shouldIgnoreChild,
  getNodeName,
  getDisplayNodeName,
};
