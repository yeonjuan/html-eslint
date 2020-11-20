const utils = require("./utils");

const NodeConverter = {
  toNode({
    childNodes,
    parentNode, // eslint-disable-line no-unused-vars
    nodeName,
    sourceCodeLocation,
    ...extra
  }) {
    const type = utils.toType(nodeName);
    return {
      type,
      ...utils.toESLocation(sourceCodeLocation, childNodes),
      extra,
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
