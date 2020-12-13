const NodeBuilder = require("./node-builder");

module.exports = function createLines(originLoc, text) {
  let start = originLoc.startOffset;
  let line = originLoc.startLine;

  return text.split("\n").map((textLine) => {
    const lengthWithoutIndent = textLine.trimStart().length;
    const indentLength = textLine.length - lengthWithoutIndent;

    start += indentLength;

    const lineLoc = {
      startOffset: start,
      endOffset: start + lengthWithoutIndent,
      startLine: line,
      endLine: line,
      startCol: indentLength + 1,
      endCol: textLine.length + 1,
    };

    line += 1;
    start += lengthWithoutIndent + 1;

    return new NodeBuilder().setLocation(lineLoc).setTextLine(textLine).build();
  });
};
