const NodeBuilder = require("./node-builder");

function getLocFromChildNodes(childNodes) {
  if (!Array.isArray(childNodes) || childNodes.length <= 0) {
    return {
      startOffset: 0,
      endOffset: 0,
      startLine: 0,
      startCol: 0,
      endCol: 0,
      endLine: 0,
    };
  }
  const [first] = childNodes;
  const last = childNodes[childNodes.length - 1];

  const { startOffset, startLine, startCol } =
    first.sourceCodeLocation || getLocFromChildNodes(first.childNodes);
  const { endOffset, endLine, endCol } =
    last.sourceCodeLocation || getLocFromChildNodes(last.childNodes);

  return {
    startOffset,
    startLine,
    startCol,
    endOffset,
    endLine,
    endCol,
  };
}

module.exports = function createProgramNode(origin) {
  const loc = getLocFromChildNodes(origin.childNodes || []);
  return new NodeBuilder()
    .setType("Program")
    .setBody([])
    .setComments([])
    .setTokens([])
    .setLocation(loc)
    .setChildNodes([])
    .build();
};
