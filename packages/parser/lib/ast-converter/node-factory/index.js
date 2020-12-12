const createProgram = require("./create-program");
const createComment = require("./create-comment");
const createText = require("./create-text");
const createNode = require("./create-node");

module.exports = {
  create(origin) {
    if (
      !origin ||
      (origin.nodeName !== "#document" && !origin.sourceCodeLocation)
    ) {
      return null;
    }
    const originType = origin.nodeName.toLowerCase();
    switch (originType) {
      case "#document":
        return createProgram(origin);
      case "#comment":
        return createComment(origin);
      case "#text":
        return createText(origin);
      default:
        return createNode(origin);
    }
  },
};
