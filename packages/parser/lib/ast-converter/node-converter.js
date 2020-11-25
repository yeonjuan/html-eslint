const utils = require("./utils");

const NodeConverter = {
  toNode(node) {
    if (utils.isEmptyHTMLNode(node)) {
      return null;
    }
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
      ...(type === "Program"
        ? {
            body: [],
            tokens: [],
            comments: [],
          }
        : {}),
    };
  },
};

module.exports = NodeConverter;
