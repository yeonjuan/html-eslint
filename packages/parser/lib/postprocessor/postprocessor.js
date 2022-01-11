const {
  canIncludeChild,
  canBeIncluded,
  hasChildNodes,
  getLocFromChildNodes,
  createLines,
  createCommentStartTag,
  createCommentEndTag,
} = require("./utils");

module.exports = class PostProcessor {
  constructor() {
    this.outRangeNodes = [];
    this.skipCommonProcess = false;
    this.programNode = null;
  }

  process(node) {
    if (typeof this[node.type] === "function") {
      this[node.type](node);
    }

    this.processOnCommonNode(node);
    return node;
  }

  processOnCommonNode(node) {
    if (Array.isArray(node.childNodes)) {
      node.childNodes.forEach((child) => {
        this.process(child);
      });
    }
    if (!this.skipCommonProcess) {
      this.processOnNode(node);
    }
    this.skipCommonProcess = false;

    this.skipCommonProcess = false;
    delete node.parentNode;
  }

  ["#document"](node) {
    const locNode = getLocFromChildNodes(node.childNodes);
    node.type = "Program";
    node.loc = locNode.loc;
    node.range = locNode.range;
    node.start = locNode.start;
    node.end = locNode.end;
    this.programNode = node;
  }

  ["#text"](node) {
    this.skipCommonProcess = true;
    node.type = "text";
    node.lineNodes = createLines(node, node.value);
  }

  ["#comment"](node) {
    this.skipCommonProcess = true;
    node.type = "comment";
    node.startTag = createCommentStartTag(node);
    node.endTag = createCommentEndTag(node);
    node.value = node.data;
    delete node.data;
    node.lineNodes = createLines(
      {
        range: [node.start + 4, node.end],
        start: node.start + 4,
        end: node.end,
        loc: {
          start: {
            line: node.loc.start.line,
            column: node.loc.start.column + 4,
          },
          end: node.loc.end,
        },
      },
      node.value
    );
    this.programNode.comments.push(node);
  }

  ["#documentType"](node) {
    node.type = "documentType";
    this.skipCommonProcess = true;
  }

  ["template"](node) {
    if (!Array.isArray(node.childNodes)) {
      node.childNodes = [];
    }
    node.childNodes.push(...node.content.childNodes);
    delete node.content;
  }

  processOnNode(node) {
    if (node.type[0] === "#") {
      node.type = node.type.slice(1);
    } else if (node.type[0] !== node.type[0].toUpperCase()) {
      node.type = node.type[0].toUpperCase() + node.type.slice(1);
    }
    this.includeOutRangeChildNodes(node);
    if (hasChildNodes(node)) {
      this.omitFakeChildNodes(node);
      if (canIncludeChild(node)) {
        this.excludeOutRangeChildNodes(node);
      }
    }
  }

  includeOutRangeChildNodes(node) {
    if (this.outRangeNodes.length && canIncludeChild(node)) {
      const includedNodes = this.outRangeNodes.filter((child) =>
        canBeIncluded(node, child)
      );
      node.childNodes.push(...includedNodes);
      this.outRangeNodes = this.outRangeNodes.filter(
        (child) => !includedNodes.includes(child)
      );
    }
  }

  excludeOutRangeChildNodes(node) {
    let index;
    while (
      (index = node.childNodes.findIndex(
        (child) =>
          child.range[1] < node.startTag.range[0] ||
          child.range[0] > node.endTag.range[1]
      )) !== -1
    ) {
      const child = node.childNodes[index];
      node.childNodes.splice(index, 1);
      this.outRangeNodes.push(child);
    }
  }

  omitFakeChildNodes(node) {
    let index;
    while ((index = node.childNodes.findIndex((child) => !child.loc)) !== -1) {
      const child = node.childNodes[index];
      node.childNodes.splice(index, 1, ...(child.childNodes || []));
    }
  }
};
