const {
  canIncludeChild,
  canBeIncluded,
  hasChildNodes,
  getLocFromChildNodes,
} = require('./utils');

module.exports = class PostProcessor {
  constructor () {
    this.outRangeNodes = [];
  }

  process (node) {
    if (node.type === "#document") {
      this.processOnDocument(node);
    }
    if (Array.isArray(node.childNodes)) {
      node.childNodes.forEach(child => {
        this.process(child);
      });
    }
    this.processOnNode(node);
    delete node.parentNode;
    return node;
  }

  processOnDocument (node) {
    const locNode = getLocFromChildNodes(node);
    node.type = 'Program';
    node.loc = locNode.loc;
    node.range = locNode.range;
    node.start = locNode.start;
    node.end = locNode.end;
  }

  processOnText (node) {
    if (node.type === "#text") {
      node.type = "text";
    }
    node.textLine
  }

  processOnNode (node) {
    if (node.type === "#text") {
      node.type = "text";
    }

    node.type = node.type[0].toUpperCase() + node.type.slice(1);
    this.includeOutRangeChildNodes(node);
    if (hasChildNodes(node)) {
      this.omitFakeChildNodes(node);
      if (canIncludeChild(node)) {
        this.excludeOutRangeChildNodes(node);
      }
    }
  }

  includeOutRangeChildNodes (node) {
    if (this.outRangeNodes.length && canIncludeChild(node)) {
      const includedNodes = this.outRangeNodes.filter(child => canBeIncluded(node, child))
      node.childNodes.push(...includedNodes);
      this.outRangeNodes = this.outRangeNodes.filter(child => includedNodes.includes(child));
    }
  }

  excludeOutRangeChildNodes (node) {
    let index;
    while (
      (index = node.childNodes.findIndex(child => !canBeIncluded(node, child))) !== -1
    ) {
      const child = node.childNodes[index];
      node.childNodes.splice(index, 1);
      this.outRangeNodes.push(child);
    }
  }

  omitFakeChildNodes (node) {
    let index;
    while (
      (index = node.childNodes.findIndex(child => !child.loc)) !== -1
    ) {
      const child = node.childNodes[index];
      node.childNodes.splice(index, 1, ...(child.childNodes || []));
    }
  }
}
