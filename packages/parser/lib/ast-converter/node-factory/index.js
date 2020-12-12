const createProgram = require("./create-program");
const createComment = require("./create-comment");
const createText = require("./create-text");
const createNode = require("./create-node");
const createNull = require('./create-null');

function isShouldBeNullNode (origin) {
  return !origin ||
  (origin.nodeName !== "#document" && !origin.sourceCodeLocation);
}

module.exports = {
  create(origin) {
    if (isShouldBeNullNode(origin)) {
      return createNull();
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
