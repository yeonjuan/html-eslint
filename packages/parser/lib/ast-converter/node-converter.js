const utils = require("./utils");

function toBaseNode(node) {
  const {
    childNodes,
    parentNode, // eslint-disable-line no-unused-vars
    nodeName,
    attrs,
    sourceCodeLocation,
    ...extra
  } = node;
  const type = utils.toType(nodeName);
  return {
    type,
    ...extra,
    ...utils.toESLocation(sourceCodeLocation, childNodes),
    // start tag
    startTag:
      sourceCodeLocation && sourceCodeLocation.startTag
        ? {
            ...utils.toESLocation(sourceCodeLocation.startTag),
          }
        : null,
    // end tag
    endTag:
      sourceCodeLocation && sourceCodeLocation.endTag
        ? {
            ...utils.toESLocation(sourceCodeLocation.endTag),
          }
        : null,
    // attributes
    attrs: attrs
      ? attrs.map((attr) => ({
          ...attr,
          ...(sourceCodeLocation && sourceCodeLocation.attrs
            ? utils.getAttrLocation(sourceCodeLocation, attr.name)
            : null),
        }))
      : [],
  };
}

function extendsToProgramNode(node) {
  return Object.assign(node, {
    body: [],
    tokens: [],
    comments: [],
  });
}

function extendsToTextNode(node) {
  return Object.assign(node, {
    lineNodes: utils.getLineNodes(node, node.value)
  });
}

function extendsToCommentNode(node) {
  return Object.assign(node, utils.getCommentTags(node), {
    lineNodes: utils.getLineNodes({
      ...node,
      range: [node.range[0] + 4],
      start: node.range[0] + 4
    }, node.data),
  });
}

const NodeConverter = {
  toNode(node) {
    if (utils.isEmptyHTMLNode(node)) {
      return null;
    }
    let base = toBaseNode(node);
    switch (base.type) {
      case "Program":
        return extendsToProgramNode(base);
      case "comment":
        return extendsToCommentNode(base);
      case "text":
        return extendsToTextNode(base);
      default:
        return base;
    }
  },
};

module.exports = NodeConverter;
