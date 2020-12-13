const NodeBuilder = require("./node-builder");
const createLines = require("./create-lines");

function createStartTag(originLoc) {
  const { startOffset, startLine, startCol } = originLoc;
  const loc = {
    startOffset,
    endOffset: startOffset + 4,
    startLine,
    startCol,
    endCol: startCol + 5,
    endLine: startLine,
  };
  return new NodeBuilder().setLocation(loc).build();
}

function createEndTag(originLoc) {
  const { endOffset, endLine, endCol } = originLoc;
  const loc = {
    startOffset: endOffset - 3,
    endOffset: endOffset + 1,
    startLine: endLine,
    endLine,
    endCol,
    startCol: endCol - 3,
  };
  return new NodeBuilder().setLocation(loc).build();
}

module.exports = function createComment(origin) {
  const originLoc = origin.sourceCodeLocation;
  const startTag = createStartTag(originLoc);
  const endTag = createEndTag(originLoc);
  const lines = createLines(
    {
      ...originLoc,
      startOffset: originLoc.startOffset + 4,
    },
    origin.data
  );
  return new NodeBuilder()
    .setType("comment")
    .setStartTag(startTag)
    .setEndTag(endTag)
    .setLocation(originLoc)
    .setData(origin.data)
    .setLineNodes(lines)
    .build();
};
